import { PensionInputs, IndexInputs } from '../Interfaces';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation rules that match the backend FluentValidation
export class InputValidator {
  static validatePensionInputs(inputs: PensionInputs): ValidationResult {
    const errors: ValidationError[] = [];

    // Starting Amount validation
    if (inputs.startAmount < 0) {
      errors.push({ field: 'startAmount', message: 'Starting amount must be non-negative' });
    }
    if (inputs.startAmount > 10_000_000) {
      errors.push({ field: 'startAmount', message: 'Starting amount cannot exceed £10,000,000' });
    }

    // Age validation
    if (inputs.startAge < 16) {
      errors.push({ field: 'startAge', message: 'Starting age must be at least 16' });
    }
    if (inputs.startAge > 75) {
      errors.push({ field: 'startAge', message: 'Starting age cannot exceed 75' });
    }
    if (inputs.endAge < 50) {
      errors.push({ field: 'endAge', message: 'Retirement age must be at least 50' });
    }
    if (inputs.endAge > 85) {
      errors.push({ field: 'endAge', message: 'Retirement age cannot exceed 85' });
    }
    if (inputs.endAge <= inputs.startAge) {
      errors.push({ field: 'endAge', message: 'Retirement age must be greater than starting age' });
    }

    // Monthly Amount validation
    if (inputs.monthlyAmount <= 0) {
      errors.push({ field: 'monthlyAmount', message: 'Monthly contribution must be greater than 0' });
    }
    if (inputs.monthlyAmount > 40_000) {
      errors.push({ field: 'monthlyAmount', message: 'Monthly contribution cannot exceed £40,000' });
    }

    // Percentage validations
    if (inputs.annualIncrease < 0) {
      errors.push({ field: 'annualIncrease', message: 'Annual increase must be non-negative' });
    }
    if (inputs.annualIncrease > 20) {
      errors.push({ field: 'annualIncrease', message: 'Annual increase cannot exceed 20%' });
    }

    if (inputs.annualReturn < 0) {
      errors.push({ field: 'annualReturn', message: 'Annual return must be non-negative' });
    }
    if (inputs.annualReturn > 25) {
      errors.push({ field: 'annualReturn', message: 'Annual return cannot exceed 25%' });
    }

    if (inputs.taxRelief < 0) {
      errors.push({ field: 'taxRelief', message: 'Tax relief must be non-negative' });
    }
    if (inputs.taxRelief > 45) {
      errors.push({ field: 'taxRelief', message: 'Tax relief cannot exceed 45%' });
    }

    if (inputs.employerContrib < 0) {
      errors.push({ field: 'employerContrib', message: 'Employer contribution must be non-negative' });
    }
    if (inputs.employerContrib > 25) {
      errors.push({ field: 'employerContrib', message: 'Employer contribution cannot exceed 25%' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateIndexInputs(inputs: IndexInputs): ValidationResult {
    const errors: ValidationError[] = [];

    // Starting Amount validation
    if (inputs.startAmount < 0) {
      errors.push({ field: 'startAmount', message: 'Starting amount must be non-negative' });
    }
    if (inputs.startAmount > 10_000_000) {
      errors.push({ field: 'startAmount', message: 'Starting amount cannot exceed £10,000,000' });
    }

    // Age validation
    if (inputs.startAge < 16) {
      errors.push({ field: 'startAge', message: 'Starting age must be at least 16' });
    }
    if (inputs.startAge > 75) {
      errors.push({ field: 'startAge', message: 'Starting age cannot exceed 75' });
    }
    if (inputs.endAge < 50) {
      errors.push({ field: 'endAge', message: 'End age must be at least 50' });
    }
    if (inputs.endAge > 85) {
      errors.push({ field: 'endAge', message: 'End age cannot exceed 85' });
    }
    if (inputs.endAge <= inputs.startAge) {
      errors.push({ field: 'endAge', message: 'End age must be greater than starting age' });
    }

    // Monthly Amount validation
    if (inputs.monthlyAmount <= 0) {
      errors.push({ field: 'monthlyAmount', message: 'Monthly contribution must be greater than 0' });
    }
    if (inputs.monthlyAmount > 40_000) {
      errors.push({ field: 'monthlyAmount', message: 'Monthly contribution cannot exceed £40,000' });
    }

    // Percentage validations
    if (inputs.annualIncrease < 0) {
      errors.push({ field: 'annualIncrease', message: 'Annual increase must be non-negative' });
    }
    if (inputs.annualIncrease > 20) {
      errors.push({ field: 'annualIncrease', message: 'Annual increase cannot exceed 20%' });
    }

    if (inputs.annualReturn < 0) {
      errors.push({ field: 'annualReturn', message: 'Annual return must be non-negative' });
    }
    if (inputs.annualReturn > 25) {
      errors.push({ field: 'annualReturn', message: 'Annual return cannot exceed 25%' });
    }

    if (inputs.withdrawalRate <= 0) {
      errors.push({ field: 'withdrawalRate', message: 'Withdrawal rate must be greater than 0' });
    }
    if (inputs.withdrawalRate > 15) {
      errors.push({ field: 'withdrawalRate', message: 'Withdrawal rate cannot exceed 15%' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAll(pensionInputs: PensionInputs, indexInputs: IndexInputs): ValidationResult {
    const pensionValidation = this.validatePensionInputs(pensionInputs);
    const indexValidation = this.validateIndexInputs(indexInputs);

    return {
      isValid: pensionValidation.isValid && indexValidation.isValid,
      errors: [...pensionValidation.errors, ...indexValidation.errors]
    };
  }
}

// Helper to get error for a specific field
export const getFieldError = (errors: ValidationError[], fieldName: string): string | undefined => {
  return errors.find(error => error.field === fieldName)?.message;
};

// Helper to check if a field has an error
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some(error => error.field === fieldName);
};