import { useState, useEffect } from "react";
import { PensionInputs, IndexInputs } from "../Interfaces";
import { InputValidator, ValidationError } from "../Helpers/validation";

export const useValidation = (
  pensionInputs: PensionInputs,
  indexInputs: IndexInputs
) => {
  const [pensionErrors, setPensionErrors] = useState<ValidationError[]>([]);
  const [indexErrors, setIndexErrors] = useState<ValidationError[]>([]);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  // Real-time validation
  useEffect(() => {
    const pensionValidation =
      InputValidator.validatePensionInputs(pensionInputs);
    const indexValidation = InputValidator.validateIndexInputs(indexInputs);

    setPensionErrors(pensionValidation.errors);
    setIndexErrors(indexValidation.errors);
  }, [pensionInputs, indexInputs]);

  const isValid = pensionErrors.length === 0 && indexErrors.length === 0;
  const allErrors = [...pensionErrors, ...indexErrors];

  const setServerValidationErrors = (errors: string[]) => {
    setServerErrors(errors);
  };

  const clearServerErrors = () => {
    setServerErrors([]);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    // Check client-side errors first
    const clientError = allErrors.find((error) => error.field === fieldName);
    if (clientError) return clientError.message;

    // Then check server errors (simplified - in a real app you'd parse field names from server errors)
    return undefined;
  };

  const hasFieldError = (fieldName: string): boolean => {
    return allErrors.some((error) => error.field === fieldName);
  };

  return {
    isValid,
    pensionErrors,
    indexErrors,
    serverErrors,
    allErrors,
    setServerValidationErrors,
    clearServerErrors,
    getFieldError,
    hasFieldError,
  };
};
