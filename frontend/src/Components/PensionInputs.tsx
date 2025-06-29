import React from 'react';
import { PensionInputs as PensionInputsType } from '../Interfaces';

interface PensionInputsProps {
  inputs: PensionInputsType;
  onChange: (inputs: PensionInputsType) => void;
}

export const PensionInputs: React.FC<PensionInputsProps> = ({ inputs, onChange }) => {
  const handleChange = (field: keyof PensionInputsType, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="controls pension-controls">
      <h3>🏛️ NEST Pension</h3>
      <div className="control-group">
        <div className="control-item">
          <label>Starting Amount (£)</label>
          <input
            type="number"
            value={inputs.startAmount}
            onChange={(e) => handleChange('startAmount', Number(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Starting Age</label>
          <input
            type="number"
            value={inputs.startAge}
            onChange={(e) => handleChange('startAge', Number(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Retirement Age</label>
          <input
            type="number"
            value={inputs.endAge}
            onChange={(e) => handleChange('endAge', Number(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Monthly Contribution (£)</label>
          <input
            type="number"
            value={inputs.monthlyAmount}
            onChange={(e) => handleChange('monthlyAmount', Number(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Annual Increase (%)</label>
          <input
            type="number"
            step="0.5"
            value={inputs.annualIncrease}
            onChange={(e) => handleChange('annualIncrease', Number(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Annual Return (%)</label>
          <input
            type="number"
            step="0.1"
            value={inputs.annualReturn}
            onChange={(e) => handleChange('annualReturn', Number(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Tax Relief Rate (%)</label>
          <input
            type="number"
            value={inputs.taxRelief}
            onChange={(e) => handleChange('taxRelief', Number(e.target.value))}
          />
        </div>
        <div className="control-item">
          <label>Employer Contribution (%)</label>
          <input
            type="number"
            step="0.5"
            value={inputs.employerContrib}
            onChange={(e) => handleChange('employerContrib', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
