import { ValidationApiError, apiService } from './ApiService';
import { CalculationRequest, CalculationResponse } from '../Interfaces';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiService', () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    delete process.env.REACT_APP_API_URL;
  });

  describe('calculateComparison', () => {
    const mockRequest: CalculationRequest = {
      pensionInputs: {
        startAmount: 10000,
        startAge: 25,
        endAge: 65,
        monthlyAmount: 500,
        annualIncrease: 3,
        annualReturn: 7,
        taxRelief: 20,
        employerContrib: 3
      },
      indexInputs: {
        startAmount: 10000,
        startAge: 25,
        endAge: 65,
        monthlyAmount: 500,
        annualIncrease: 3,
        annualReturn: 7,
        withdrawalRate: 4,
        isISA: false
      }
    };

    const mockResponse: CalculationResponse = {
      pension: {
        finalBalance: 500000,
        yearlyBalances: [10000, 20000, 30000],
        totalContributions: 100000,
        years: 40
      },
      index: {
        finalBalance: 600000,
        yearlyBalances: [12000, 24000, 36000],
        totalContributions: 100000,
        years: 40
      },
      difference: 100000,
      calculationId: 'test-calc-123'
    };

    it('should successfully calculate comparison', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      } as any);

      const result = await apiService.calculateComparison(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7071/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockRequest)
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ValidationApiError for 400 status with details', async () => {
      const errorResponse = {
        error: 'Validation failed',
        details: ['Age must be positive', 'Amount too large']
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValueOnce(errorResponse)
      } as any);

      await expect(apiService.calculateComparison(mockRequest))
        .rejects.toThrow(ValidationApiError);
    });

    it('should throw generic Error for other error statuses', async () => {
      const errorResponse = { error: 'Internal server error' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValueOnce(errorResponse)
      } as any);

      await expect(apiService.calculateComparison(mockRequest))
        .rejects.toThrow('Internal server error');
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      } as any);

      await expect(apiService.calculateComparison(mockRequest))
        .rejects.toThrow('Unknown error');
    });
  });

  describe('healthCheck', () => {
    const mockHealthResponse = {
      status: 'healthy',
      timestamp: '2023-01-01T00:00:00Z'
    };

    it('should successfully perform health check', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockHealthResponse)
      } as any);

      const result = await apiService.healthCheck();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7071/api/health');
      expect(result).toEqual(mockHealthResponse);
    });

    it('should throw error for failed health check', async () => {
      const errorResponse = { error: 'Service unavailable' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(errorResponse)
      } as any);

      await expect(apiService.healthCheck())
        .rejects.toThrow('Service unavailable');
    });

    it('should handle JSON parsing errors in health check', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      } as any);

      await expect(apiService.healthCheck())
        .rejects.toThrow('Health check failed');
    });
  });

  describe('getAnalytics', () => {
    const mockAnalyticsResponse = {
      totalCalculations: 1000,
      averageAge: 35
    };

    it('should successfully get analytics', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockAnalyticsResponse)
      } as any);

      const result = await apiService.getAnalytics();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:7071/api/analytics');
      expect(result).toEqual(mockAnalyticsResponse);
    });

    it('should throw error for failed analytics request', async () => {
      const errorResponse = { error: 'Analytics unavailable' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(errorResponse)
      } as any);

      await expect(apiService.getAnalytics())
        .rejects.toThrow('Analytics unavailable');
    });

    it('should handle JSON parsing errors in analytics', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      } as any);

      await expect(apiService.getAnalytics())
        .rejects.toThrow('Failed to fetch analytics');
    });
  });

  describe('getApiUrl', () => {
    it('should return the current API URL', () => {
      expect(apiService.getApiUrl()).toBe('http://localhost:7071/api');
    });
  });
});