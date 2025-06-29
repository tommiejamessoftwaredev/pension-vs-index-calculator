import React from 'react';

export const DisclaimerWarning: React.FC = () => {
  return (
    <div className="warning">
      <strong>⚠️ Important Notes:</strong> This comparison includes employer pension contributions. 
      Annual contribution increases simulate wage growth over career. Actual returns will vary, and 
      past performance doesn't guarantee future results. Tax rules and rates may change. Consider 
      seeking professional financial advice for your specific situation.
    </div>
  );
};