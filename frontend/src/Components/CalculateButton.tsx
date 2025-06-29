import React from 'react';

interface CalculateButtonProps {
  loading: boolean;
  onClick: () => void;
  error?: string | null;
  disabled?: boolean;
  validationErrors?: number;
}

export const CalculateButton: React.FC<CalculateButtonProps> = ({
  loading,
  onClick,
  error,
  disabled = false,
  validationErrors = 0
}) => {
  const isDisabled = loading || disabled || validationErrors > 0;

  return (
    <div className="calculate-section">
      <button
        className={`calculate-button ${isDisabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={isDisabled}
      >
        {loading ? 'Calculating...' : '🧮 Calculate Comparison'}
      </button>

      {validationErrors > 0 && (
        <div className="validation-summary">
          ⚠️ Please fix {validationErrors} validation error{validationErrors !== 1 ? 's' : ''} before calculating
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};