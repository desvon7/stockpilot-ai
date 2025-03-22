
import {
  GET_PORTFOLIO,
  BUY_STOCK,
  SELL_STOCK,
  GET_PERFORMANCE_HISTORY,
  PORTFOLIO_ERROR
} from '@/actions/types';

interface PortfolioState {
  portfolio: any | null;
  performanceHistory: any[];
  loading: boolean;
  error: any | null;
}

const initialState: PortfolioState = {
  portfolio: null,
  performanceHistory: [],
  loading: true,
  error: null
};

const portfolioReducer = (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PORTFOLIO:
      return {
        ...state,
        portfolio: payload,
        loading: false
      };
    case BUY_STOCK:
    case SELL_STOCK:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          positions: payload.positions,
          totalValue: payload.totalValue,
          buyingPower: payload.buyingPower
        },
        loading: false
      };
    case GET_PERFORMANCE_HISTORY:
      return {
        ...state,
        performanceHistory: payload,
        loading: false
      };
    case PORTFOLIO_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default portfolioReducer;
