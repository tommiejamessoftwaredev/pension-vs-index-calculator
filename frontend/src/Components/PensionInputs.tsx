import React from 'react';
import { PensionInputs as PensionInputsType } from '../Interfaces';
import { ValidatedInput } from '../Components';

interface PensionInputsProps {
  inputs: PensionInputsType;
  onChange: (inputs: PensionInputsType) => void;
  getFieldError: (fieldName: string) => string | undefined;
  hasFieldError: (fieldName: string) => boolean;
}

export const PensionInputs: React.FC<PensionInputsProps> = ({
  inputs,
  onChange,
  getFieldError,
  hasFieldError
}) => {
  const handleChange = (field: keyof PensionInputsType, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className={`controls pension-controls ${hasFieldError('startAmount') || hasFieldError('startAge') || hasFieldError('endAge') || hasFieldError('monthlyAmount') || hasFieldError('annualIncrease') || hasFieldError('annualReturn') || hasFieldError('taxRelief') || hasFieldError('employerContrib') ? 'has-errors' : ''}`}>
      <h3>🏛️ Pension</h3>
      <div className="control-group">
        <ValidatedInput
          label="Starting Amount (£)"
          value={inputs.startAmount}
          onChange={(value) => handleChange('startAmount', value)}
          error={getFieldError('startAmount')}
          min="0"
          max="10000000"
        />

        <ValidatedInput
          label="Starting Age"
          value={inputs.startAge}
          onChange={(value) => handleChange('startAge', value)}
          error={getFieldError('startAge')}
          min="16"
          max="75"
        />

        <ValidatedInput
          label="Retirement Age"
          value={inputs.endAge}
          onChange={(value) => handleChange('endAge', value)}
          error={getFieldError('endAge')}
          min="50"
          max="85"
        />

        <ValidatedInput
          label="Monthly Contribution (£)"
          value={inputs.monthlyAmount}
          onChange={(value) => handleChange('monthlyAmount', value)}
          error={getFieldError('monthlyAmount')}
          min="1"
          max="40000"
        />

        <ValidatedInput
          label="Annual Increase (%)"
          value={inputs.annualIncrease}
          onChange={(value) => handleChange('annualIncrease', value)}
          error={getFieldError('annualIncrease')}
          step="0.5"
          min="0"
          max="20"
        />

        <ValidatedInput
          label="Annual Return (%)"
          value={inputs.annualReturn}
          onChange={(value) => handleChange('annualReturn', value)}
          error={getFieldError('annualReturn')}
          step="0.1"
          min="0"
          max="25"
        />

        <ValidatedInput
          label="Tax Relief Rate (%)"
          value={inputs.taxRelief}
          onChange={(value) => handleChange('taxRelief', value)}
          error={getFieldError('taxRelief')}
          min="0"
          max="45"
        />

        <ValidatedInput
          label="Employer Contribution (%)"
          value={inputs.employerContrib}
          onChange={(value) => handleChange('employerContrib', value)}
          error={getFieldError('employerContrib')}
          step="0.5"
          min="0"
          max="25"
        />
      </div>
    </div>
  );
};