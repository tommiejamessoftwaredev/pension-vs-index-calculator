export interface PensionInputs {
  startAmount: number;
  startAge: number;
  endAge: number;
  monthlyAmount: number;
  annualIncrease: number;
  annualReturn: number;
  taxRelief: number;
  employerContrib: number;
}

export interface IndexInputs {
  startAmount: number;
  startAge: number;
  endAge: number;
  monthlyAmount: number;
  annualIncrease: number;
  annualReturn: number;
  withdrawalRate: number;
}

export interface CalculationResult {
  pension: {
    finalBalance: number;
    yearlyBalances: number[];
    totalEmployeeContrib: number;
    totalEmployerContrib: number;
    years: number;
  };
  index: {
    finalBalance: number;
    yearlyBalances: number[];
    totalContributions: number;
    capitalGainsTax: number;
    years: number;
  };
  difference: number;
  calculationId: string;
}

export interface AnalyticsData {
  userAgent: string;
  country: string;
  timestamp: string;
  screenResolution: string;
  timezone: string;
  language: string;
}