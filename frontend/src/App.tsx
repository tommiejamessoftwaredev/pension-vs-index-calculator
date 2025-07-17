import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

import {
  PensionInputs,
  IndexInputs,
  CalculateButton,
  CalculationResults,
  ComparisonChart,
  ComparisonTable,
  Assumptions,
  DisclaimerWarning,
  CookieConsentBanner,
} from './Components';

import { usePensionCalculator } from './Hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App: React.FC = () => {
  const {
    pensionInputs,
    setPensionInputs,
    indexInputs,
    setIndexInputs,
    results,
    loading,
    error,
    handleCalculate,
    handleCookieConsent,
    validation,
  } = usePensionCalculator();

  return (
    <div className="app">
      <div className="container">
        <h1>Pension vs Index Fund Investment</h1>
        <p className="subtitle">
          Flexible comparison with separate controls for each investment type
        </p>

        <div className="controls-wrapper">
          <PensionInputs
            inputs={pensionInputs}
            onChange={setPensionInputs}
            getFieldError={validation.getFieldError}
            hasFieldError={validation.hasFieldError}
          />
          <IndexInputs
            inputs={indexInputs}
            onChange={setIndexInputs}
            getFieldError={validation.getFieldError}
            hasFieldError={validation.hasFieldError}
          />
        </div>

        <CalculateButton
          loading={loading}
          onClick={handleCalculate}
          error={error}
          disabled={!validation.isValid}
          validationErrors={validation.allErrors.length}
        />

        {validation.allErrors.length > 0 && (
          <div className="validation-errors-summary">
            <h4>⚠️ Please fix these issues:</h4>
            <ul>
              {validation.allErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        {validation.serverErrors.length > 0 && (
          <div className="server-validation-errors">
            <h4>🚫 Server Validation Errors:</h4>
            <ul>
              {validation.serverErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {results && (
          <>
            <CalculationResults results={results} />
            <ComparisonChart
              results={results}
              pensionInputs={pensionInputs}
              indexInputs={indexInputs}
            />
          </>
        )}

        <ComparisonTable />
        <Assumptions />
        <DisclaimerWarning />
      </div>

      <CookieConsentBanner onAccept={handleCookieConsent} />
    </div>
  );
};

export default App;