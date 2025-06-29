import { AnalyticsData, CalculationRequest, CalculationResponse } from '../Interfaces';

class ApiService {
  private baseUrl: string;

  constructor() {
    // React environment variables must start with REACT_APP_
    this.baseUrl = process.env.REACT_APP_API_URL || '/api';
    
    // Remove trailing slash if present
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
  }

  async calculateComparison(request: CalculationRequest): Promise<CalculationResponse> {
    const response = await fetch(`${this.baseUrl}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Calculation failed');
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }

  async getAnalytics(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/analytics`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  }

  // Helper method to get the current API URL (useful for debugging)
  getApiUrl(): string {
    return this.baseUrl;
  }
}

export const apiService = new ApiService();