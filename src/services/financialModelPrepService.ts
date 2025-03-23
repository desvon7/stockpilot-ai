
import { supabase } from '@/integrations/supabase/client';

export interface FinancialStatement {
  date: string;
  symbol: string;
  period: string;
  [key: string]: any;
}

export interface CompanyProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: number;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface KeyMetric {
  date: string;
  symbol: string;
  period: string;
  revenuePerShare: number;
  netIncomePerShare: number;
  operatingCashFlowPerShare: number;
  freeCashFlowPerShare: number;
  cashPerShare: number;
  bookValuePerShare: number;
  tangibleBookValuePerShare: number;
  shareholdersEquityPerShare: number;
  interestDebtPerShare: number;
  marketCap: number;
  enterpriseValue: number;
  peRatio: number;
  priceToSalesRatio: number;
  pocfratio: number;
  pfcfRatio: number;
  pbRatio: number;
  ptbRatio: number;
  evToSales: number;
  enterpriseValueOverEBITDA: number;
  evToOperatingCashFlow: number;
  evToFreeCashFlow: number;
  earningsYield: number;
  freeCashFlowYield: number;
  debtToEquity: number;
  debtToAssets: number;
  netDebtToEBITDA: number;
  currentRatio: number;
  interestCoverage: number;
  incomeQuality: number;
  dividendYield: number;
  payoutRatio: number;
  salesGeneralAndAdministrativeToRevenue: number;
  researchAndDevelopementToRevenue: number;
  intangiblesToTotalAssets: number;
  capexToOperatingCashFlow: number;
  capexToRevenue: number;
  capexToDepreciation: number;
  stockBasedCompensationToRevenue: number;
  grahamNumber: number;
  roic: number;
  returnOnTangibleAssets: number;
  grahamNetNet: number;
  workingCapital: number;
  tangibleAssetValue: number;
  netCurrentAssetValue: number;
  investedCapital: number;
  averageReceivables: number;
  averagePayables: number;
  averageInventory: number;
  daysSalesOutstanding: number;
  daysPayablesOutstanding: number;
  daysOfInventoryOnHand: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
  roe: number;
  capexPerShare: number;
}

export interface FinancialRatio {
  symbol: string;
  date: string;
  period: string;
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  daysOfSalesOutstanding: number;
  daysOfInventoryOutstanding: number;
  operatingCycle: number;
  daysOfPayablesOutstanding: number;
  cashConversionCycle: number;
  grossProfitMargin: number;
  operatingProfitMargin: number;
  pretaxProfitMargin: number;
  netProfitMargin: number;
  effectiveTaxRate: number;
  returnOnAssets: number;
  returnOnEquity: number;
  returnOnCapitalEmployed: number;
  netIncomePerEBT: number;
  ebtPerEbit: number;
  ebitPerRevenue: number;
  debtRatio: number;
  debtEquityRatio: number;
  longTermDebtToCapitalization: number;
  totalDebtToCapitalization: number;
  interestCoverage: number;
  cashFlowToDebtRatio: number;
  companyEquityMultiplier: number;
  receivablesTurnover: number;
  payablesTurnover: number;
  inventoryTurnover: number;
  fixedAssetTurnover: number;
  assetTurnover: number;
  operatingCashFlowPerShare: number;
  freeCashFlowPerShare: number;
  cashPerShare: number;
  payoutRatio: number;
  operatingCashFlowSalesRatio: number;
  freeCashFlowOperatingCashFlowRatio: number;
  cashFlowCoverageRatios: number;
  shortTermCoverageRatios: number;
  capitalExpenditureCoverageRatio: number;
  dividendPaidAndCapexCoverageRatio: number;
  dividendPayoutRatio: number;
  priceBookValueRatio: number;
  priceToBookRatio: number;
  priceToSalesRatio: number;
  priceEarningsRatio: number;
  priceToFreeCashFlowsRatio: number;
  priceToOperatingCashFlowsRatio: number;
  priceCashFlowRatio: number;
  priceEarningsToGrowthRatio: number;
  priceSalesRatio: number;
  dividendYield: number;
  enterpriseValueMultiple: number;
  priceFairValue: number;
}

export interface EarningsData {
  date: string;
  symbol: string;
  eps: number;
  epsEstimated: number;
  time: string;
  revenue: number;
  revenueEstimated: number;
  updatedFromDate: string;
  fiscalDateEnding: string;
}

export const getCompanyProfile = async (symbol: string): Promise<CompanyProfile | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('financial-model-prep', {
      body: { endpoint: 'company_profile', symbol }
    });

    if (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data[0] as CompanyProfile;
    }

    return null;
  } catch (error) {
    console.error('Error in getCompanyProfile:', error);
    throw error;
  }
};

export const getIncomeStatements = async (symbol: string, period: 'annual' | 'quarter' = 'annual', limit: number = 5): Promise<FinancialStatement[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('financial-model-prep', {
      body: { endpoint: 'income_statement', symbol, period, limit }
    });

    if (error) {
      console.error('Error fetching income statements:', error);
      throw error;
    }

    return data as FinancialStatement[];
  } catch (error) {
    console.error('Error in getIncomeStatements:', error);
    throw error;
  }
};

export const getBalanceSheets = async (symbol: string, period: 'annual' | 'quarter' = 'annual', limit: number = 5): Promise<FinancialStatement[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('financial-model-prep', {
      body: { endpoint: 'balance_sheet', symbol, period, limit }
    });

    if (error) {
      console.error('Error fetching balance sheets:', error);
      throw error;
    }

    return data as FinancialStatement[];
  } catch (error) {
    console.error('Error in getBalanceSheets:', error);
    throw error;
  }
};

export const getCashFlowStatements = async (symbol: string, period: 'annual' | 'quarter' = 'annual', limit: number = 5): Promise<FinancialStatement[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('financial-model-prep', {
      body: { endpoint: 'cash_flow', symbol, period, limit }
    });

    if (error) {
      console.error('Error fetching cash flow statements:', error);
      throw error;
    }

    return data as FinancialStatement[];
  } catch (error) {
    console.error('Error in getCashFlowStatements:', error);
    throw error;
  }
};

export const getKeyMetrics = async (symbol: string, period: 'annual' | 'quarter' = 'annual', limit: number = 5): Promise<KeyMetric[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('financial-model-prep', {
      body: { endpoint: 'key_metrics', symbol, period, limit }
    });

    if (error) {
      console.error('Error fetching key metrics:', error);
      throw error;
    }

    return data as KeyMetric[];
  } catch (error) {
    console.error('Error in getKeyMetrics:', error);
    throw error;
  }
};

export const getFinancialRatios = async (symbol: string, period: 'annual' | 'quarter' = 'annual', limit: number = 5): Promise<FinancialRatio[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('financial-model-prep', {
      body: { endpoint: 'ratios', symbol, period, limit }
    });

    if (error) {
      console.error('Error fetching financial ratios:', error);
      throw error;
    }

    return data as FinancialRatio[];
  } catch (error) {
    console.error('Error in getFinancialRatios:', error);
    throw error;
  }
};

export const getEarnings = async (symbol: string, limit: number = 10): Promise<EarningsData[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('financial-model-prep', {
      body: { endpoint: 'earnings', symbol, limit }
    });

    if (error) {
      console.error('Error fetching earnings data:', error);
      throw error;
    }

    return data as EarningsData[];
  } catch (error) {
    console.error('Error in getEarnings:', error);
    throw error;
  }
};
