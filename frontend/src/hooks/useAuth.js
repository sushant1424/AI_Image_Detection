import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { ROUTES } from 'src/constants';
import {
  setLoading,
  setUser,
  setToken,
  setError,
  logout as logoutAction,
  clearError as clearErrorAction,
} from 'src/store/authSlice';
import { loginUser, registerUser, getCurrentUser } from 'src/api/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(async (credentials) => {
    try {
      dispatch(setLoading());
      const data = await loginUser(credentials);
      dispatch(setToken(data.access_token));
      
      // Fetch user profile immediately
      const profile = await getCurrentUser();
      dispatch(setUser(profile));
      
      toast.success('Successfully logged in!');
      navigate(ROUTES.DETECT);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to login';
      dispatch(setError(errMsg));
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  }, [dispatch, navigate, toast]);

  const register = useCallback(async (userData) => {
    try {
      dispatch(setLoading());
      await registerUser(userData);
      
      // Auto-login after successful registration
      const loginData = await loginUser({
        email: userData.email,
        password: userData.password,
      });
      dispatch(setToken(loginData.access_token));
      
      const profile = await getCurrentUser();
      dispatch(setUser(profile));
      
      toast.success('Account created successfully!');
      navigate(ROUTES.DETECT);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to register';
      dispatch(setError(errMsg));
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  }, [dispatch, navigate, toast]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    toast.info('Logged out successfully');
    navigate(ROUTES.HOME);
  }, [dispatch, navigate, toast]);

  const clearError = useCallback(() => {
    dispatch(clearErrorAction());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};

export default useAuth;
