import React from 'react';
import { Line } from 'react-chartjs-2';
import { CalculationResponse, PensionInputs, IndexInputs } from '../Interfaces';
import { generateChartData, getChartOptions } from '../Helpers/chartHelper';

interface ComparisonChartProps {
  results: CalculationResponse;
  pensionInputs: PensionInputs;
  indexInputs: IndexInputs;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ 
  results, 
  pensionInputs, 
  indexInputs 
}) => {
  const chartData = generateChartData(results, pensionInputs, indexInputs);
  const chartOptions = getChartOptions();

  if (!chartData) return null;

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};