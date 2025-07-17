import { InputValidator, getFieldError, hasFieldError, ValidationError } from './validation';
import { PensionInputs, IndexInputs } from '../Interfaces';

describe('InputValidator', () => {
  describe('validatePensionInputs', () => {
    const validPensionInputs: PensionInputs = {
      startAmount: 10000,
      startAge: 25,
      endAge: 65,
      monthlyAmount: 500,
      annualIncrease: 3,
      annualReturn: 7,
      taxRelief: 20,
      employerContrib: 3
    };

    it('should return valid result for valid inputs', () => {
      const result = InputValidator.validatePensionInputs(validPensionInputs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate startAmount range', () => {
      const invalidInputs = { ...validPensionInputs, startAmount: -100 };
      const result = InputValidator.validatePensionInputs(invalidInputs);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'startAmount',
        message: 'Starting amount must be non-negative'
      });

      const tooLargeInputs = { ...validPensionInputs, startAmount: 15_000_000 };
      const resultTooLarge = InputValidator.validatePensionInputs(tooLargeInputs);
      expect(resultTooLarge.isValid).toBe(false);
      expect(resultTooLarge.errors).toContainEqual({
        field: 'startAmount',
        message: 'Starting amount cannot exceed £10,000,000'
      });
    });

    it('should validate age ranges', () => {
      const youngAge = { ...validPensionInputs, startAge: 15 };
      const result = InputValidator.validatePensionInputs(youngAge);
      expect(result.errors).toContainEqual({
        field: 'startAge',
        message: 'Starting age must be at least 16'
      });

      const oldAge = { ...validPensionInputs, startAge: 80 };
      const resultOld = InputValidator.validatePensionInputs(oldAge);
      expect(resultOld.errors).toContainEqual({
        field: 'startAge',
        message: 'Starting age cannot exceed 75'
      });

      const earlyRetirement = { ...validPensionInputs, endAge: 45 };
      const resultEarly = InputValidator.validatePensionInputs(earlyRetirement);
      expect(resultEarly.errors).toContainEqual({
        field: 'endAge',
        message: 'Retirement age must be at least 50'
      });

      const lateRetirement = { ...validPensionInputs, endAge: 90 };
      const resultLate = InputValidator.validatePensionInputs(lateRetirement);
      expect(resultLate.errors).toContainEqual({
        field: 'endAge',
        message: 'Retirement age cannot exceed 85'
      });

      const invalidAgeOrder = { ...validPensionInputs, startAge: 65, endAge: 60 };
      const resultOrder = InputValidator.validatePensionInputs(invalidAgeOrder);
      expect(resultOrder.errors).toContainEqual({
        field: 'endAge',
        message: 'Retirement age must be greater than starting age'
      });
    });

    it('should validate monthly amount', () => {
      const zeroAmount = { ...validPensionInputs, monthlyAmount: 0 };
      const result = InputValidator.validatePensionInputs(zeroAmount);
      expect(result.errors).toContainEqual({
        field: 'monthlyAmount',
        message: 'Monthly contribution must be greater than 0'
      });

      const tooLargeAmount = { ...validPensionInputs, monthlyAmount: 50000 };
      const resultLarge = InputValidator.validatePensionInputs(tooLargeAmount);
      expect(resultLarge.errors).toContainEqual({
        field: 'monthlyAmount',
        message: 'Monthly contribution cannot exceed £40,000'
      });
    });

    it('should validate percentage fields', () => {
      const negativeIncrease = { ...validPensionInputs, annualIncrease: -1 };
      const result = InputValidator.validatePensionInputs(negativeIncrease);
      expect(result.errors).toContainEqual({
        field: 'annualIncrease',
        message: 'Annual increase must be non-negative'
      });

      const tooHighReturn = { ...validPensionInputs, annualReturn: 30 };
      const resultHigh = InputValidator.validatePensionInputs(tooHighReturn);
      expect(resultHigh.errors).toContainEqual({
        field: 'annualReturn',
        message: 'Annual return cannot exceed 25%'
      });

      const tooHighTaxRelief = { ...validPensionInputs, taxRelief: 50 };
      const resultTax = InputValidator.validatePensionInputs(tooHighTaxRelief);
      expect(resultTax.errors).toContainEqual({
        field: 'taxRelief',
        message: 'Tax relief cannot exceed 45%'
      });

      const tooHighEmployer = { ...validPensionInputs, employerContrib: 30 };
      const resultEmployer = InputValidator.validatePensionInputs(tooHighEmployer);
      expect(resultEmployer.errors).toContainEqual({
        field: 'employerContrib',
        message: 'Employer contribution cannot exceed 25%'
      });
    });
  });

  describe('validateIndexInputs', () => {
    const validIndexInputs: IndexInputs = {
      startAmount: 10000,
      startAge: 25,
      endAge: 65,
      monthlyAmount: 500,
      annualIncrease: 3,
      annualReturn: 7,
      withdrawalRate: 4,
      isISA: false
    };

    it('should return valid result for valid inputs', () => {
      const result = InputValidator.validateIndexInputs(validIndexInputs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate withdrawal rate', () => {
      const zeroWithdrawal = { ...validIndexInputs, withdrawalRate: 0 };
      const result = InputValidator.validateIndexInputs(zeroWithdrawal);
      expect(result.errors).toContainEqual({
        field: 'withdrawalRate',
        message: 'Withdrawal rate must be greater than 0'
      });

      const tooHighWithdrawal = { ...validIndexInputs, withdrawalRate: 20 };
      const resultHigh = InputValidator.validateIndexInputs(tooHighWithdrawal);
      expect(resultHigh.errors).toContainEqual({
        field: 'withdrawalRate',
        message: 'Withdrawal rate cannot exceed 15%'
      });
    });
  });

  describe('validateAll', () => {
    const validPensionInputs: PensionInputs = {
      startAmount: 10000,
      startAge: 25,
      endAge: 65,
      monthlyAmount: 500,
      annualIncrease: 3,
      annualReturn: 7,
      taxRelief: 20,
      employerContrib: 3
    };

    const validIndexInputs: IndexInputs = {
      startAmount: 10000,
      startAge: 25,
      endAge: 65,
      monthlyAmount: 500,
      annualIncrease: 3,
      annualReturn: 7,
      withdrawalRate: 4,
      isISA: false
    };

    it('should return valid when both inputs are valid', () => {
      const result = InputValidator.validateAll(validPensionInputs, validIndexInputs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should combine errors from both validations', () => {
      const invalidPension = { ...validPensionInputs, startAge: 15 };
      const invalidIndex = { ...validIndexInputs, withdrawalRate: 0 };
      
      const result = InputValidator.validateAll(invalidPension, invalidIndex);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContainEqual({
        field: 'startAge',
        message: 'Starting age must be at least 16'
      });
      expect(result.errors).toContainEqual({
        field: 'withdrawalRate',
        message: 'Withdrawal rate must be greater than 0'
      });
    });
  });
});

describe('Helper functions', () => {
  const errors: ValidationError[] = [
    { field: 'startAge', message: 'Age too low' },
    { field: 'monthlyAmount', message: 'Amount too high' }
  ];

  describe('getFieldError', () => {
    it('should return error message for existing field', () => {
      expect(getFieldError(errors, 'startAge')).toBe('Age too low');
      expect(getFieldError(errors, 'monthlyAmount')).toBe('Amount too high');
    });

    it('should return undefined for non-existing field', () => {
      expect(getFieldError(errors, 'nonExistent')).toBeUndefined();
    });
  });

  describe('hasFieldError', () => {
    it('should return true for existing field error', () => {
      expect(hasFieldError(errors, 'startAge')).toBe(true);
      expect(hasFieldError(errors, 'monthlyAmount')).toBe(true);
    });

    it('should return false for non-existing field error', () => {
      expect(hasFieldError(errors, 'nonExistent')).toBe(false);
    });
  });
});