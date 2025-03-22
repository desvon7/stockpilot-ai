
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  UPDATE_BUYING_POWER
} from '@/actions/types';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: any | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null
};

const authReducer = (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      if (payload.session) {
        localStorage.setItem('token', payload.session.access_token);
      }
      return {
        ...state,
        token: payload.session ? payload.session.access_token : null,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case UPDATE_BUYING_POWER:
      return {
        ...state,
        user: {
          ...state.user,
          buyingPower: payload
        }
      };
    default:
      return state;
  }
};

export default authReducer;
