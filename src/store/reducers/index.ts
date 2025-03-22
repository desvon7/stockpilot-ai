
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import stockReducer from './stockReducer';
import portfolioReducer from './portfolioReducer';
import watchlistReducer from './watchlistReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  stock: stockReducer,
  portfolio: portfolioReducer,
  watchlist: watchlistReducer
});
