
import { SET_ALERT, REMOVE_ALERT } from '@/actions/types';

interface Alert {
  id: string;
  msg: string;
  alertType: 'success' | 'error' | 'warning' | 'info' | 'danger';
}

interface AlertAction {
  type: typeof SET_ALERT | typeof REMOVE_ALERT;
  payload: string | Alert;
}

const initialState: Alert[] = [];

const alertReducer = (state = initialState, action: AlertAction) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload as Alert];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
};

export default alertReducer;
