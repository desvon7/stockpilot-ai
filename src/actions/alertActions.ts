
import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';
import { toast } from 'sonner';

// Interface for alerts
export interface Alert {
  id: string;
  msg: string;
  alertType: 'success' | 'error' | 'warning' | 'info' | 'danger';
}

// Set alert
export const setAlert = (msg: string, alertType: Alert['alertType'], timeout = 5000) => (dispatch: any) => {
  const id = uuidv4();
  
  // Dispatch the alert to Redux
  dispatch({
    type: SET_ALERT,
    payload: { id, msg, alertType }
  });

  // Also show a toast notification
  if (alertType === 'danger') {
    toast.error(msg);
  } else if (alertType === 'success') {
    toast.success(msg);
  } else if (alertType === 'warning') {
    toast.warning(msg);
  } else {
    toast.info(msg);
  }

  // Automatically remove alert after timeout
  setTimeout(() =>
    dispatch({
      type: REMOVE_ALERT,
      payload: id
    }),
    timeout
  );
};
