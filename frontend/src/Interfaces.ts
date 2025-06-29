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

export interface AnalyticsData {
  userAgent: string;
  timestamp: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

export interface CalculationRequest {
  pensionInputs: PensionInputs;
  indexInputs: IndexInputs;
  analytics?: AnalyticsData;
}

export interface CalculationResult {
  finalBalance: number;
  yearlyBalances: number[];
  totalEmployeeContrib?: number;
  totalEmployerContrib?: number;
  totalContributions?: number;
  capitalGainsTax?: number;
  years: number;
}

// Complete response from backend (matches C# CalculationResponse)
export interface CalculationResponse {
  pension: CalculationResult;
  index: CalculationResult;
  difference: number;
  calculationId: string;
}