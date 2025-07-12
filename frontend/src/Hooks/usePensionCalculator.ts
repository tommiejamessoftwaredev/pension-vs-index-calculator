import { useState, useEffect } from "react";
import { PensionInputs, IndexInputs, CalculationResponse } from "../Interfaces";
import { apiService, ValidationApiError, CookieService } from "../Services";
import { collectAnalyticsData } from "../Helpers";
import { useValidation } from "./useValidation";

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
    isISA: false,
  });

  const [results, setResults] = useState<CalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  // Use validation hook
  const validation = useValidation(pensionInputs, indexInputs);

  useEffect(() => {
    setCookiesAccepted(CookieService.hasConsent());
  }, []);

  const handleCalculate = async () => {
    // Clear previous errors
    setError(null);
    validation.clearServerErrors();

    // Check client-side validation first
    if (!validation.isValid) {
      setError("Please fix the validation errors before calculating");
      return;
    }

    setLoading(true);

    try {
      const analyticsData = cookiesAccepted
        ? collectAnalyticsData()
        : undefined;

      const request = {
        pensionInputs,
        indexInputs,
        analytics: analyticsData,
      };

      const result = await apiService.calculateComparison(request);
      setResults(result);
    } catch (err) {
      if (err instanceof ValidationApiError) {
        // Handle server-side validation errors
        validation.setServerValidationErrors(err.details);
        setError(`Validation failed: ${err.details.join(", ")}`);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCookieConsent = () => {
    CookieService.setConsent(true);
    setCookiesAccepted(true);
  };

  return {
    // State
    pensionInputs,
    setPensionInputs,
    indexInputs,
    setIndexInputs,
    results,
    loading,
    error,
    cookiesAccepted,

    // Actions
    handleCalculate,
    handleCookieConsent,

    // Validation
    validation,
  };
};
