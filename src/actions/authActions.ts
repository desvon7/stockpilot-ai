
import { supabase } from '@/lib/supabase';
import { setAlert } from './alertActions';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  UPDATE_BUYING_POWER
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Interface for user data
interface UserData {
  firstName?: string;
  lastName?: string;
  email: string;
  buyingPower?: number;
  id?: string;
}

// Load User
export const loadUser = () => async (dispatch: any) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw error;
    }

    // Get additional user profile data from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    const userData: UserData = {
      id: user.id,
      email: user.email || '',
      firstName: profileData?.first_name || profileData?.full_name || '',
      lastName: profileData?.last_name || '',
      buyingPower: profileData?.buying_power || 0
    };

    dispatch({
      type: USER_LOADED,
      payload: userData
    });
  } catch (err) {
    console.error('Load user error:', err);
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ firstName, lastName, email, password }: { 
  firstName: string; 
  lastName: string; 
  email: string; 
  password: string;
}) => async (dispatch: any) => {
  try {
    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          { 
            id: data.user.id, 
            full_name: `${firstName} ${lastName}`,
            first_name: firstName, 
            last_name: lastName,
            email,
            buying_power: 10000 // Start with $10,000
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      dispatch({
        type: REGISTER_SUCCESS,
        payload: { 
          user: data.user,
          session: data.session 
        }
      });

      // If we have a session, load the user data
      if (data.session) {
        setAuthToken(data.session.access_token);
        dispatch(loadUser());
      }
    }
  } catch (err: any) {
    console.error('Registration error:', err);
    
    dispatch(setAlert(err.message || 'Registration failed', 'danger'));
    
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email: string, password: string) => async (dispatch: any) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user: data.user,
        session: data.session
      }
    });

    // If we have a session, set the token and load user data
    if (data.session) {
      setAuthToken(data.session.access_token);
      dispatch(loadUser());
    }
  } catch (err: any) {
    console.error('Login error:', err);
    
    dispatch(setAlert(err.message || 'Login failed', 'danger'));
    
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const logout = () => async (dispatch: any) => {
  try {
    await supabase.auth.signOut();
    setAuthToken(null);
  } catch (err) {
    console.error('Logout error:', err);
  }
  
  dispatch({ type: LOGOUT });
};

// Update Buying Power
export const updateBuyingPower = (amount: number) => async (dispatch: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update buying power in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({ buying_power: amount })
      .eq('id', user.id)
      .select('buying_power')
      .single();

    if (error) throw error;

    dispatch({
      type: UPDATE_BUYING_POWER,
      payload: data?.buying_power || 0
    });

    dispatch(setAlert('Buying power updated', 'success'));
  } catch (err: any) {
    console.error('Update buying power error:', err);
    dispatch(setAlert(err.message || 'Failed to update buying power', 'danger'));
  }
};
