
import {
  GET_STOCK,
  GET_STOCK_CHART,
  GET_STOCK_NEWS,
  SEARCH_STOCKS,
  GET_TOP_GAINERS,
  GET_TOP_LOSERS,
  STOCK_ERROR,
  CLEAR_STOCK
} from '@/actions/types';

interface StockState {
  stock: any | null;
  stocks: any[];
  chart: any | null;
  news: any[];
  topGainers: any[];
  topLosers: any[];
  loading: boolean;
  error: any | null;
}

const initialState: StockState = {
  stock: null,
  stocks: [],
  chart: null,
  news: [],
  topGainers: [],
  topLosers: [],
  loading: true,
  error: null
};

const stockReducer = (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_STOCK:
      return {
        ...state,
        stock: payload,
        loading: false
      };
    case GET_STOCK_CHART:
      return {
        ...state,
        chart: payload,
        loading: false
      };
    case GET_STOCK_NEWS:
      return {
        ...state,
        news: payload,
        loading: false
      };
    case SEARCH_STOCKS:
      return {
        ...state,
        stocks: payload,
        loading: false
      };
    case GET_TOP_GAINERS:
      return {
        ...state,
        topGainers: payload,
        loading: false
      };
    case GET_TOP_LOSERS:
      return {
        ...state,
        topLosers: payload,
        loading: false
      };
    case STOCK_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_STOCK:
      return {
        ...state,
        stock: null,
        chart: null,
        news: [],
        loading: false
      };
    default:
      return state;
  }
};

export default stockReducer;
