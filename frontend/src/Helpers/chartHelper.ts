import { CalculationResponse, PensionInputs, IndexInputs } from '../Interfaces';
import { formatCurrency } from './formatters';

export const generateChartData = (
  results: CalculationResponse,
  pensionInputs: PensionInputs,
  indexInputs: IndexInputs
) => {
  if (!results) return null;

  const minAge = Math.min(pensionInputs.startAge, indexInputs.startAge);
  const maxAge = Math.max(pensionInputs.endAge, indexInputs.endAge);
  const ages = Array.from({ length: maxAge - minAge }, (_, i) => minAge + i + 1);

  const pensionData = ages.map(age => {
    if (age > pensionInputs.startAge && age <= pensionInputs.endAge) {
      const index = age - pensionInputs.startAge - 1;
      return results.pension.yearlyBalances[index] || null;
    }
    return null;
  });

  const indexData = ages.map(age => {
    if (age > indexInputs.startAge && age <= indexInputs.endAge) {
      const index = age - indexInputs.startAge - 1;
      return results.index.yearlyBalances[index] || null;
    }
    return null;
  });

  return {
    labels: ages,
    datasets: [
      {
        label: 'Pension',
        data: pensionData,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 6,
        spanGaps: false,
      },
      {
        label: 'Index Fund (after tax)',
        data: indexData,
        borderColor: '#764ba2',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 6,
        spanGaps: false,
      },
    ],
  };
};

export const getChartOptions = () => ({
  responsive: true,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    title: {
      display: true,
      text: 'Investment Growth Over Time',
      font: {
        size: 16,
        weight: 'bold' as const,
      },
    },
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: function(context: any) {
          return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Age',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
      grid: {
        color: 'rgba(0,0,0,0.1)',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Investment Value (£)',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
      ticks: {
        callback: function(value: any) {
          return formatCurrency(value);
        },
      },
      grid: {
        color: 'rgba(0,0,0,0.1)',
      },
    },
  },
});