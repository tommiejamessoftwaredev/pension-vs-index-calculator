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
  } = usePensionCalculator();

  return (
    <div className="app">
      <div className="container">
        <h1>💰 NEST Pension vs Index Fund Investment</h1>
        <p className="subtitle">
          Flexible comparison with separate controls for each investment type
        </p>

        <div className="controls-wrapper">
          <PensionInputs 
            inputs={pensionInputs} 
            onChange={setPensionInputs} 
          />
          <IndexInputs 
            inputs={indexInputs} 
            onChange={setIndexInputs} 
          />
        </div>

        <CalculateButton 
          loading={loading}
          onClick={handleCalculate}
          error={error}
        />

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