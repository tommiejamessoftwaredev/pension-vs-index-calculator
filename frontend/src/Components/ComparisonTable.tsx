import React from 'react';

export const ComparisonTable: React.FC = () => {
  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Factor</th>
          <th>Pension</th>
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
  );
};