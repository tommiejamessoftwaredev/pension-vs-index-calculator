// server.ts
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import geoip from 'geoip-lite';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';
import dotenv from 'dotenv';
import { CalculationRequest, CalculationResult } from './Interfaces';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Azure Table Storage setup
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const credential = new AzureNamedKeyCredential(accountName, accountKey);

const calculationsTable = new TableClient(
  `https://${accountName}.table.core.windows.net`,
  'calculations',
  credential
);

const analyticsTable = new TableClient(
  `https://${accountName}.table.core.windows.net`,
  'analytics',
  credential
);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);


// Calculation functions
function calculateCompoundGrowth(
  startAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number,
  taxRelief: number = 0,
  annualCharges: number = 0,
  employerContrib: number = 0,
  annualIncrease: number = 0
): CalculationResult {
  const effectiveAnnualRate = annualRate - annualCharges;
  const effectiveMonthlyRate = effectiveAnnualRate / 12 / 100;
  const months = years * 12;
  
  const assumedMonthlySalary = 2500; // £30k/year
  
  let balance = startAmount;
  const yearlyBalances: number[] = [];
  let currentMonthlyAmount = monthlyAmount;
  let totalEmployeeContrib = startAmount;
  let totalEmployerContrib = 0;
  
  for (let month = 1; month <= months; month++) {
    const effectiveMonthlyAmount = currentMonthlyAmount * (1 + taxRelief / 100);
    const monthlyEmployerContrib = assumedMonthlySalary * (employerContrib / 100);
    const totalMonthlyContrib = effectiveMonthlyAmount + monthlyEmployerContrib;
    
    balance = balance * (1 + effectiveMonthlyRate) + totalMonthlyContrib;
    
    totalEmployeeContrib += currentMonthlyAmount;
    totalEmployerContrib += monthlyEmployerContrib;
    
    if (month % 12 === 0) {
      yearlyBalances.push(balance);
      currentMonthlyAmount = currentMonthlyAmount * (1 + annualIncrease / 100);
    }
  }
  
  return {
    finalBalance: balance,
    yearlyBalances,
    totalEmployeeContrib,
    totalEmployerContrib,
    years
  };
}

function calculateIndexGrowthWithTax(
  startAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number,
  annualCharges: number = 0.2,
  withdrawalRate: number = 4,
  annualIncrease: number = 0
): CalculationResult {
  const monthlyRate = (annualRate - annualCharges) / 12 / 100;
  const months = years * 12;
  const capitalGainsAllowance = 6000;
  const capitalGainsRate = 0.20;
  
  let balance = startAmount;
  let totalContributions = startAmount;
  const yearlyBalances: number[] = [];
  let currentMonthlyAmount = monthlyAmount;
  
  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + currentMonthlyAmount;
    totalContributions += currentMonthlyAmount;
    
    if (month % 12 === 0) {
      yearlyBalances.push(balance);
      currentMonthlyAmount = currentMonthlyAmount * (1 + annualIncrease / 100);
    }
  }
  
  // Calculate tax on withdrawal
  const retirementYears = 25;
  const annualWithdrawal = balance * (withdrawalRate / 100);
  let remainingBalance = balance;
  let remainingContributions = totalContributions;
  let totalCapitalGainsTax = 0;
  
  for (let year = 1; year <= retirementYears && remainingBalance > 0; year++) {
    remainingBalance *= (1 + (annualRate - annualCharges) / 100);
    
    const withdrawAmount = Math.min(annualWithdrawal, remainingBalance);
    const gainsRatio = Math.max(0, (remainingBalance - remainingContributions) / remainingBalance);
    const gainsPortion = withdrawAmount * gainsRatio;
    const contributionsPortion = withdrawAmount * (1 - gainsRatio);
    
    const taxableGains = Math.max(0, gainsPortion - capitalGainsAllowance);
    const yearlyTax = taxableGains * capitalGainsRate;
    totalCapitalGainsTax += yearlyTax;
    
    remainingBalance -= withdrawAmount;
    remainingContributions -= contributionsPortion;
    
    if (remainingBalance < 1000) break;
  }
  
  const effectiveValue = balance - totalCapitalGainsTax;
  
  return {
    finalBalance: effectiveValue,
    yearlyBalances,
    totalContributions,
    capitalGainsTax: totalCapitalGainsTax,
    years
  };
}

// API Routes
app.post('/api/calculate', async (req: express.Request, res: express.Response) => {
  try {
    const { pensionInputs, indexInputs, analytics }: CalculationRequest = req.body;
    
    // Validate inputs
    if (!pensionInputs || !indexInputs) {
      return res.status(400).json({ error: 'Missing required inputs' });
    }
    
    // Generate unique calculation ID
    const calculationId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Get client IP and country
    const clientIP = req.ip || req.connection.remoteAddress || '';
    const geo = geoip.lookup(clientIP);
    const country = geo?.country || 'Unknown';
    
    // Calculate pension
    const pensionYears = pensionInputs.endAge - pensionInputs.startAge;
    const pensionResult = calculateCompoundGrowth(
      pensionInputs.startAmount,
      pensionInputs.monthlyAmount,
      pensionInputs.annualReturn,
      pensionYears,
      pensionInputs.taxRelief,
      0.75, // NEST charges
      pensionInputs.employerContrib,
      pensionInputs.annualIncrease
    );
    
    // Calculate index fund
    const indexYears = indexInputs.endAge - indexInputs.startAge;
    const indexResult = calculateIndexGrowthWithTax(
      indexInputs.startAmount,
      indexInputs.monthlyAmount,
      indexInputs.annualReturn,
      indexYears,
      0.2, // Index fund charges
      indexInputs.withdrawalRate,
      indexInputs.annualIncrease
    );
    
    const difference = pensionResult.finalBalance - indexResult.finalBalance;
    
    // Store calculation in Azure Table Storage
    const calculationEntity = {
      partitionKey: 'calculation',
      rowKey: calculationId,
      timestamp: timestamp,
      pensionInputs: JSON.stringify(pensionInputs),
      indexInputs: JSON.stringify(indexInputs),
      pensionResult: JSON.stringify(pensionResult),
      indexResult: JSON.stringify(indexResult),
      difference: difference,
      clientIP: clientIP,
      country: country
    };
    
    await calculationsTable.createEntity(calculationEntity);
    
    // Store analytics if provided
    if (analytics) {
      const analyticsEntity = {
        partitionKey: 'analytics',
        rowKey: uuidv4(),
        calculationId: calculationId,
        timestamp: timestamp,
        userAgent: analytics.userAgent,
        country: country,
        screenResolution: analytics.screenResolution,
        timezone: analytics.timezone,
        language: analytics.language,
        clientIP: clientIP
      };
      
      await analyticsTable.createEntity(analyticsEntity);
    }
    
    // Return results
    const response = {
      pension: pensionResult,
      index: indexResult,
      difference: difference,
      calculationId: calculationId
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Analytics endpoint (for admin dashboard)
app.get('/api/analytics', async (req: express.Request, res: express.Response) => {
  try {
    // Add authentication here in production
    const calculations = calculationsTable.listEntities();
    const analytics = analyticsTable.listEntities();
    
    const calculationsList = [];
    for await (const entity of calculations) {
      calculationsList.push(entity);
    }
    
    const analyticsList = [];
    for await (const entity of analytics) {
      analyticsList.push(entity);
    }
    
    res.json({
      totalCalculations: calculationsList.length,
      calculations: calculationsList.slice(-100), // Last 100 calculations
      analytics: analyticsList.slice(-100) // Last 100 analytics records
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize Azure Tables
async function initializeTables() {
  try {
    await calculationsTable.createTable();
    console.log('Calculations table ready');
  } catch (error:any) {
    if (error.statusCode !== 409) { // Table already exists
      console.error('Error creating calculations table:', error);
    }
  }
  
  try {
    await analyticsTable.createTable();
    console.log('Analytics table ready');
  } catch (error:any) {
    if (error.statusCode !== 409) { // Table already exists
      console.error('Error creating analytics table:', error);
    }
  }
}

// Start server
app.listen(PORT, async () => {
  await initializeTables();
  console.log(`Server running on port ${PORT}`);
});

export default app;