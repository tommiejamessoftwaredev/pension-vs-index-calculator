import React from 'react';
import { IndexInputs as IndexInputsType } from '../Interfaces';
import { ValidatedInput } from '../Components';

interface IndexInputsProps {
  inputs: IndexInputsType;
  onChange: (inputs: IndexInputsType) => void;
  getFieldError: (fieldName: string) => string | undefined;
  hasFieldError: (fieldName: string) => boolean;
}

export const IndexInputs: React.FC<IndexInputsProps> = ({
  inputs,
  onChange,
  getFieldError,
  hasFieldError
}) => {
  const handleChange = (field: keyof IndexInputsType, value: number | boolean) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className={`controls index-controls ${hasFieldError('startAmount') || hasFieldError('startAge') || hasFieldError('endAge') || hasFieldError('monthlyAmount') || hasFieldError('annualIncrease') || hasFieldError('annualReturn') || hasFieldError('withdrawalRate') ? 'has-errors' : ''}`}>
      <h3>📈 Index Fund</h3>
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
          label="Withdrawal Rate (%/year)"
          value={inputs.withdrawalRate}
          onChange={(value) => handleChange('withdrawalRate', value)}
          error={getFieldError('withdrawalRate')}
          step="0.5"
          min="0.1"
          max="15"
        />

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={inputs.isISA}
              onChange={(e) => handleChange('isISA', e.target.checked)}
            />
            Stocks & Shares ISA (tax-free withdrawals)
          </label>
        </div>
      </div>
    </div>
  );
};