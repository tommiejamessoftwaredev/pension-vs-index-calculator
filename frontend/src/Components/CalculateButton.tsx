import React from 'react';

interface CalculateButtonProps {
  loading: boolean;
  onClick: () => void;
  error?: string | null;
}

export const CalculateButton: React.FC<CalculateButtonProps> = ({ loading, onClick, error }) => {
  return (
    <div className="calculate-section">
      <button
        className="calculate-button"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? 'Calculating...' : '🧮 Calculate Comparison'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};