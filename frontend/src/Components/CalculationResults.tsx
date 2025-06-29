import React from 'react';
import { CalculationResponse } from '../Interfaces';
import { formatCurrency } from '../Helpers/formatters';

interface CalculationResultsProps {
  results: CalculationResponse;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ results }) => {
  return (
    <div className="key-results">
      <div className="result-card">
        <h3>💼 Pension</h3>
        <div className="amount">{formatCurrency(results.pension.finalBalance)}</div>
        <p>
          Over {results.pension.years} years<br />
          Including {formatCurrency(results.pension.totalEmployerContrib || 0)} employer contributions
        </p>
      </div>
      <div className="result-card">
        <h3>📈 Index Fund</h3>
        <div className="amount">{formatCurrency(results.index.finalBalance)}</div>
        <p>
          Over {results.index.years} years<br />
          After {formatCurrency(results.index.capitalGainsTax || 0)} tax on withdrawals
        </p>
      </div>
      <div className="result-card">
        <h3>📊 Difference</h3>
        <div 
          className="amount" 
          style={{ color: results.difference >= 0 ? '#27ae60' : '#e74c3c' }}
        >
          {results.difference >= 0 ? '+' : ''}{formatCurrency(results.difference)}
        </div>
        <p>{results.difference >= 0 ? 'Pension advantage' : 'Index fund advantage'}</p>
      </div>
      <div className="result-card">
        <h3>💰 Total Contributions</h3>
        <div className="amount">{formatCurrency(results.pension.totalEmployeeContrib || 0)}</div>
        <p>
          Pension: {formatCurrency(results.pension.totalEmployeeContrib || 0)}<br />
          Index: {formatCurrency(results.index.totalContributions || 0)}
        </p>
      </div>
    </div>
  );
};