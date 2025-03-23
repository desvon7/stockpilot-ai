
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as financialService from '@/services/financialModelPrepService';

type FinancialPeriod = 'annual' | 'quarter';

export const useCompanyProfile = (symbol: string, enabled = true) => {
  return useQuery({
    queryKey: ['companyProfile', symbol],
    queryFn: () => financialService.getCompanyProfile(symbol),
    enabled: !!symbol && enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch company profile: ${error.message}`);
      }
    }
  });
};

export const useIncomeStatements = (symbol: string, period: FinancialPeriod = 'annual', limit = 5, enabled = true) => {
  return useQuery({
    queryKey: ['incomeStatements', symbol, period, limit],
    queryFn: () => financialService.getIncomeStatements(symbol, period, limit),
    enabled: !!symbol && enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch income statements: ${error.message}`);
      }
    }
  });
};

export const useBalanceSheets = (symbol: string, period: FinancialPeriod = 'annual', limit = 5, enabled = true) => {
  return useQuery({
    queryKey: ['balanceSheets', symbol, period, limit],
    queryFn: () => financialService.getBalanceSheets(symbol, period, limit),
    enabled: !!symbol && enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch balance sheets: ${error.message}`);
      }
    }
  });
};

export const useCashFlowStatements = (symbol: string, period: FinancialPeriod = 'annual', limit = 5, enabled = true) => {
  return useQuery({
    queryKey: ['cashFlowStatements', symbol, period, limit],
    queryFn: () => financialService.getCashFlowStatements(symbol, period, limit),
    enabled: !!symbol && enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch cash flow statements: ${error.message}`);
      }
    }
  });
};

export const useKeyMetrics = (symbol: string, period: FinancialPeriod = 'annual', limit = 5, enabled = true) => {
  return useQuery({
    queryKey: ['keyMetrics', symbol, period, limit],
    queryFn: () => financialService.getKeyMetrics(symbol, period, limit),
    enabled: !!symbol && enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch key metrics: ${error.message}`);
      }
    }
  });
};

export const useFinancialRatios = (symbol: string, period: FinancialPeriod = 'annual', limit = 5, enabled = true) => {
  return useQuery({
    queryKey: ['financialRatios', symbol, period, limit],
    queryFn: () => financialService.getFinancialRatios(symbol, period, limit),
    enabled: !!symbol && enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch financial ratios: ${error.message}`);
      }
    }
  });
};

export const useEarnings = (symbol: string, limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['earnings', symbol, limit],
    queryFn: () => financialService.getEarnings(symbol, limit),
    enabled: !!symbol && enabled,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch earnings data: ${error.message}`);
      }
    }
  });
};

export const useFinancialStatement = (
  symbol: string,
  statementType: 'income' | 'balance' | 'cash-flow',
  period: FinancialPeriod = 'annual',
  limit = 5,
  enabled = true
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const incomeQuery = useIncomeStatements(symbol, period, limit, statementType === 'income' && enabled);
  const balanceQuery = useBalanceSheets(symbol, period, limit, statementType === 'balance' && enabled);
  const cashFlowQuery = useCashFlowStatements(symbol, period, limit, statementType === 'cash-flow' && enabled);

  let data;
  let currentError = null;
  let currentLoading = false;

  switch (statementType) {
    case 'income':
      data = incomeQuery.data;
      currentError = incomeQuery.error;
      currentLoading = incomeQuery.isLoading;
      break;
    case 'balance':
      data = balanceQuery.data;
      currentError = balanceQuery.error;
      currentLoading = balanceQuery.isLoading;
      break;
    case 'cash-flow':
      data = cashFlowQuery.data;
      currentError = cashFlowQuery.error;
      currentLoading = cashFlowQuery.isLoading;
      break;
  }

  return {
    data,
    isLoading: currentLoading,
    error: currentError
  };
};
