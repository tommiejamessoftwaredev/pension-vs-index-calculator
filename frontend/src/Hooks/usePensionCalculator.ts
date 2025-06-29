import { useState, useEffect } from 'react';
import { PensionInputs, IndexInputs, CalculationResponse } from '../Interfaces';
import { apiService } from '../Services/ApiService';
import { CookieService } from '../Services/CookieService';
import { collectAnalyticsData } from '../Helpers/analytics';

export const usePensionCalculator = () => {
  const [pensionInputs, setPensionInputs] = useState<PensionInputs>({
    startAmount: 0,
    startAge: 30,
    endAge: 66,
    monthlyAmount: 100,
    annualIncrease: 3,
    annualReturn: 5.5,
    taxRelief: 20,
    employerContrib: 3,
  });

  const [indexInputs, setIndexInputs] = useState<IndexInputs>({
    startAmount: 0,
    startAge: 30,
    endAge: 66,
    monthlyAmount: 100,
    annualIncrease: 3,
    annualReturn: 7.0,
    withdrawalRate: 4,
  });

  const [results, setResults] = useState<CalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    setCookiesAccepted(CookieService.hasConsent());
  }, []);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const analyticsData = cookiesAccepted ? collectAnalyticsData() : undefined;
      
      const request = {
        pensionInputs,
        indexInputs,
        analytics: analyticsData,
      };

      const result = await apiService.calculateComparison(request);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCookieConsent = () => {
    CookieService.setConsent(true);
    setCookiesAccepted(true);
  };

  return {
    pensionInputs,
    setPensionInputs,
    indexInputs,
    setIndexInputs,
    results,
    loading,
    error,
    cookiesAccepted,
    handleCalculate,
    handleCookieConsent,
  };
};
