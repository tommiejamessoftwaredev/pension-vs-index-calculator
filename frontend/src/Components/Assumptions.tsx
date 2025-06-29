import React from 'react';

export const Assumptions: React.FC = () => {
  return (
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
  );
};