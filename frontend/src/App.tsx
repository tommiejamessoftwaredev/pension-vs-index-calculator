// App.tsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import CookieConsent from 'react-cookie-consent';
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
import { AnalyticsData, CalculationResult, IndexInputs, PensionInputs } from './Interfaces';

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
  const [pensionInputs, setPensionInputs] = useState<PensionInputs>({
    startAmount: 0,
    startAge: 30,
    endAge: 66,
    monthlyAmount: 100,
    annualIncrease: 3,
    annualReturn: 5.5,
    taxRelief: 20,
    employerContrib: 3,
  });

  const [indexInputs, setIndexInputs] = useState<IndexInputs>({
    startAmount: 0,
    startAge: 30,
    endAge: 66,
    monthlyAmount: 100,
    annualIncrease: 3,
    annualReturn: 7.0,
    withdrawalRate: 4,
  });

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // Check if cookies were previously accepted
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      setCookiesAccepted(true);
    }
  }, []);

  const collectAnalyticsData = (): AnalyticsData => {
    return {
      userAgent: navigator.userAgent,
      country: '', // Will be filled by backend using IP geolocation
      timestamp: new Date().toISOString(),
      // eslint-disable-next-line no-restricted-globals
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const analyticsData = cookiesAccepted ? collectAnalyticsData() : null;
      
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pensionInputs,
          indexInputs,
          analytics: analyticsData,
        }),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const result: CalculationResult = await response.json();
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCookieConsent = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setCookiesAccepted(true);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateChartData = () => {
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
          label: 'NEST Pension',
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

  const chartOptions = {
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
  };

  return (
    <div className="app">
      <div className="container">
        <h1>💰 NEST Pension vs Index Fund Investment</h1>
        <p className="subtitle">
          Flexible comparison with separate controls for each investment type
        </p>

        <div className="controls-wrapper">
          <div className="controls pension-controls">
            <h3>🏛️ NEST Pension</h3>
            <div className="control-group">
              <div className="control-item">
                <label>Starting Amount (£)</label>
                <input
                  type="number"
                  value={pensionInputs.startAmount}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      startAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Starting Age</label>
                <input
                  type="number"
                  value={pensionInputs.startAge}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      startAge: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Retirement Age</label>
                <input
                  type="number"
                  value={pensionInputs.endAge}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      endAge: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Monthly Contribution (£)</label>
                <input
                  type="number"
                  value={pensionInputs.monthlyAmount}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      monthlyAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Annual Increase (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={pensionInputs.annualIncrease}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      annualIncrease: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={pensionInputs.annualReturn}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      annualReturn: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Tax Relief Rate (%)</label>
                <input
                  type="number"
                  value={pensionInputs.taxRelief}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      taxRelief: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Employer Contribution (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={pensionInputs.employerContrib}
                  onChange={(e) =>
                    setPensionInputs({
                      ...pensionInputs,
                      employerContrib: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="controls index-controls">
            <h3>📈 Index Fund</h3>
            <div className="control-group">
              <div className="control-item">
                <label>Starting Amount (£)</label>
                <input
                  type="number"
                  value={indexInputs.startAmount}
                  onChange={(e) =>
                    setIndexInputs({
                      ...indexInputs,
                      startAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Starting Age</label>
                <input
                  type="number"
                  value={indexInputs.startAge}
                  onChange={(e) =>
                    setIndexInputs({
                      ...indexInputs,
                      startAge: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Retirement Age</label>
                <input
                  type="number"
                  value={indexInputs.endAge}
                  onChange={(e) =>
                    setIndexInputs({
                      ...indexInputs,
                      endAge: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Monthly Contribution (£)</label>
                <input
                  type="number"
                  value={indexInputs.monthlyAmount}
                  onChange={(e) =>
                    setIndexInputs({
                      ...indexInputs,
                      monthlyAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Annual Increase (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={indexInputs.annualIncrease}
                  onChange={(e) =>
                    setIndexInputs({
                      ...indexInputs,
                      annualIncrease: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={indexInputs.annualReturn}
                  onChange={(e) =>
                    setIndexInputs({
                      ...indexInputs,
                      annualReturn: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="control-item">
                <label>Withdrawal Rate (%/year)</label>
                <input
                  type="number"
                  step="0.5"
                  value={indexInputs.withdrawalRate}
                  onChange={(e) =>
                    setIndexInputs({
                      ...indexInputs,
                      withdrawalRate: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="calculate-section">
          <button
            className="calculate-button"
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? 'Calculating...' : '🧮 Calculate Comparison'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>

        {results && (
          <>
            <div className="key-results">
              <div className="result-card">
                <h3>💼 NEST Pension</h3>
                <div className="amount">{formatCurrency(results.pension.finalBalance)}</div>
                <p>
                  Over {results.pension.years} years<br />
                  Including {formatCurrency(results.pension.totalEmployerContrib)} employer contributions
                </p>
              </div>
              <div className="result-card">
                <h3>📈 Index Fund</h3>
                <div className="amount">{formatCurrency(results.index.finalBalance)}</div>
                <p>
                  Over {results.index.years} years<br />
                  After {formatCurrency(results.index.capitalGainsTax)} tax on withdrawals
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
                <div className="amount">{formatCurrency(results.pension.totalEmployeeContrib)}</div>
                <p>
                  Pension: {formatCurrency(results.pension.totalEmployeeContrib)}<br />
                  Index: {formatCurrency(results.index.totalContributions)}
                </p>
              </div>
            </div>

            <div className="chart-container">
              <Line data={generateChartData()!} options={chartOptions} />
            </div>
          </>
        )}

        <table className="comparison-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>NEST Pension</th>
              <th>Direct Index Fund</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Tax Relief</strong></td>
              <td>✅ 20% basic rate (25% higher rate)</td>
              <td>❌ None</td>
            </tr>
            <tr>
              <td><strong>Access</strong></td>
              <td>❌ Age 57+ only (25% tax-free)</td>
              <td>✅ Anytime</td>
            </tr>
            <tr>
              <td><strong>Annual Charges</strong></td>
              <td>0.3% + fund charges (~0.75% total)</td>
              <td>~0.2% (low-cost index funds)</td>
            </tr>
            <tr>
              <td><strong>Tax on Growth</strong></td>
              <td>Tax-free growth</td>
              <td>Capital gains tax (20% on gains above £6,000/year during withdrawal)</td>
            </tr>
            <tr>
              <td><strong>Employer Contributions</strong></td>
              <td>✅ Minimum 3% (included in calculation)</td>
              <td>❌ None</td>
            </tr>
            <tr>
              <td><strong>Investment Control</strong></td>
              <td>Limited fund choices</td>
              <td>Full control over investments</td>
            </tr>
          </tbody>
        </table>

        <div className="assumptions">
          <h3>📊 Key Assumptions Used</h3>
          <ul>
            <li><strong>NEST Pension:</strong> 5.5% annual return (post-fees), 20% tax relief, 0.75% total annual charges</li>
            <li><strong>Index Fund:</strong> 7% annual return (pre-tax), 0.2% annual charges, realistic withdrawal strategy using £6,000 capital gains allowance each year</li>
            <li><strong>Withdrawal Strategy:</strong> 4% per year over 25 years of retirement, maximizing capital gains allowance annually</li>
            <li><strong>Employer Contributions:</strong> 3% of £30,000 annual salary (£75/month) - only applies to pension</li>
            <li><strong>Contributions:</strong> Starting contribution with annual increases to simulate wage growth</li>
            <li><strong>Age Range:</strong> Separate customizable investment periods for each option</li>
            <li><strong>Starting Amounts:</strong> Any existing lump sum can be added to either investment</li>
            <li><strong>Inflation:</strong> Not adjusted for inflation in these figures</li>
            <li><strong>Tax rates:</strong> Assumed to remain constant (unlikely in reality)</li>
          </ul>
        </div>

        <div className="warning">
          <strong>⚠️ Important Notes:</strong> This comparison includes employer pension contributions. Annual contribution increases simulate wage growth over career. Actual returns will vary, and past performance doesn't guarantee future results. Tax rules and rates may change. Consider seeking professional financial advice for your specific situation.
        </div>
      </div>

      <CookieConsent
        location="bottom"
        buttonText="Accept All Cookies"
        declineButtonText="Decline"
        enableDeclineButton
        onAccept={handleCookieConsent}
        style={{
          background: "#2B373B",
          fontSize: "14px",
          padding: "20px"
        }}
        buttonStyle={{
          color: "#4e503b",
          fontSize: "13px",
          background: "#f1f1f1",
          borderRadius: "5px",
          padding: "10px 20px"
        }}
        declineButtonStyle={{
          fontSize: "13px",
          background: "transparent",
          borderRadius: "5px",
          border: "1px solid #f1f1f1",
          color: "#f1f1f1",
          padding: "10px 20px",
          marginRight: "10px"
        }}
      >
        This website uses cookies to enhance user experience and collect anonymous analytics data including browser information, country, and usage patterns to improve our pension comparison tool. By accepting, you consent to data collection as described in our privacy policy.
        <span style={{ fontSize: "12px", marginLeft: "10px" }}>
          <a href="/privacy-policy" style={{ color: "#f1f1f1" }}>
            Privacy Policy
          </a>
        </span>
      </CookieConsent>
    </div>
  );
};

export default App;