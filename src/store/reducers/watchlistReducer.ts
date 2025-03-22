
import {
  GET_WATCHLISTS,
  CREATE_WATCHLIST,
  UPDATE_WATCHLIST,
  DELETE_WATCHLIST,
  ADD_STOCK_TO_WATCHLIST,
  REMOVE_STOCK_FROM_WATCHLIST,
  WATCHLIST_ERROR
} from '@/actions/types';

interface WatchlistState {
  watchlists: any[];
  loading: boolean;
  error: any | null;
}

const initialState: WatchlistState = {
  watchlists: [],
  loading: true,
  error: null
};

const watchlistReducer = (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case GET_WATCHLISTS:
      return {
        ...state,
        watchlists: payload,
        loading: false
      };
    case CREATE_WATCHLIST:
      return {
        ...state,
        watchlists: [...state.watchlists, payload],
        loading: false
      };
    case UPDATE_WATCHLIST:
      return {
        ...state,
        watchlists: state.watchlists.map(watchlist =>
          watchlist.id === payload.id ? payload : watchlist
        ),
        loading: false
      };
    case DELETE_WATCHLIST:
      return {
        ...state,
        watchlists: state.watchlists.filter(watchlist => watchlist.id !== payload),
        loading: false
      };
    case ADD_STOCK_TO_WATCHLIST:
      return {
        ...state,
        watchlists: state.watchlists.map(watchlist =>
          watchlist.id === payload.watchlistId
            ? {
                ...watchlist,
                watchlist_items: [...(watchlist.watchlist_items || []), payload.item]
              }
            : watchlist
        ),
        loading: false
      };
    case REMOVE_STOCK_FROM_WATCHLIST:
      return {
        ...state,
        watchlists: state.watchlists.map(watchlist =>
          watchlist.id === payload.watchlistId
            ? {
                ...watchlist,
                watchlist_items: watchlist.watchlist_items.filter(
                  (item: any) => item.id !== payload.itemId
                )
              }
            : watchlist
        ),
        loading: false
      };
    case WATCHLIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default watchlistReducer;
