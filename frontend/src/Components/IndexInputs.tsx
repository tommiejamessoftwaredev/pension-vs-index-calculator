import React from 'react';
import { IndexInputs as IndexInputsType } from '../Interfaces';

interface IndexInputsProps {
  inputs: IndexInputsType;
  onChange: (inputs: IndexInputsType) => void;
}

export const IndexInputs: React.FC<IndexInputsProps> = ({ inputs, onChange }) => {
  const handleChange = (field: keyof IndexInputsType, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="controls index-controls">
      <h3>📈 Index Fund</h3>
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
          <label>Withdrawal Rate (%/year)</label>
          <input
            type="number"
            step="0.5"
            value={inputs.withdrawalRate}
            onChange={(e) => handleChange('withdrawalRate', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};