import { CookieService } from './CookieService';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('CookieService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hasConsent', () => {
    it('should return true when consent is accepted', () => {
      localStorageMock.getItem.mockReturnValue('accepted');
      
      const result = CookieService.hasConsent();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('cookieConsent');
      expect(result).toBe(true);
    });

    it('should return false when consent is declined', () => {
      localStorageMock.getItem.mockReturnValue('declined');
      
      const result = CookieService.hasConsent();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('cookieConsent');
      expect(result).toBe(false);
    });

    it('should return false when no consent is stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = CookieService.hasConsent();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('cookieConsent');
      expect(result).toBe(false);
    });

    it('should return false for any other stored value', () => {
      localStorageMock.getItem.mockReturnValue('someOtherValue');
      
      const result = CookieService.hasConsent();
      
      expect(result).toBe(false);
    });
  });

  describe('setConsent', () => {
    it('should store "accepted" when consent is true', () => {
      CookieService.setConsent(true);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cookieConsent', 'accepted');
    });

    it('should store "declined" when consent is false', () => {
      CookieService.setConsent(false);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cookieConsent', 'declined');
    });
  });

  describe('clearConsent', () => {
    it('should remove consent from localStorage', () => {
      CookieService.clearConsent();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cookieConsent');
    });
  });
});