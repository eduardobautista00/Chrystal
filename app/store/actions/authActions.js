// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const AGENT_REQUEST = 'AGENT_REQUEST';
export const AGENT_SUCCESS = 'AGENT_SUCCESS';
export const AGENT_FAILURE = 'AGENT_FAILURE';
export const LOGOUT = 'LOGOUT';

import getEnvVars from '../../config/env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import checkUserAuthentication from '../../context/AuthContext';

const { apiUrl } = getEnvVars();

class AuthActions {
  registerDeviceToken = async (userToken) => {
    try {
      const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", expoPushToken);
      
      if (expoPushToken) {
        await axios.post(
          `${apiUrl}/update-device-token`,
          { device_token: expoPushToken },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        await AsyncStorage.setItem('deviceToken', expoPushToken);
        console.log('Device token registered:', expoPushToken);
      } else {
        console.log('Failed to get push token');
      }
    } catch (error) {
      console.error('Error registering device token:', error);
    }
  }

  registerUser = async (dispatch, userInfo) => {
    console.log("Agent Info being sent to API:", userInfo);
    dispatch({ type: 'REGISTER_REQUEST' });

    try {
      const response = await axios.post(`${apiUrl}/register`, {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        phone_number: userInfo.phone_number,
        password: userInfo.password,
      });

      console.log("API Response:", response.data);

      const user = {
        first_name: response.data.user.first_name,
        last_name: response.data.user.last_name,
        email: response.data.user.email,
        phone_number: response.data.user.phone_number,
        user_id: response.data.user.id,
      };
      console.log(user, "responseresponseresponse");

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: user
        },
      });
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      
      dispatch({
        type: 'REGISTER_FAILURE',
        error: error.response?.data || 'Registration failed',
      });
    }
  };

  loginUser = async (dispatch, email, password) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      console.log('Login attempt for:', email);

      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });

      console.log('Login response:', response.data);

      if (!response.data.access_token) {
        throw new Error('No token received from server');
      }

      const user_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      const user = response.data.user;
      const permission = response.data.permissions;

      // Store token in AsyncStorage
      try {
        await AsyncStorage.setItem('access_token', user_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);
        // Verify token was stored
        const storedAccessToken = await AsyncStorage.getItem('access_token');
        const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
        console.log('Token stored successfully:', storedAccessToken ? 'Yes' : 'No');
        console.log('Refresh Token stored successfully:', storedRefreshToken ? 'Yes' : 'No');
        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error('Failed to store token');
        }
      } catch (storageError) {
        console.error('Error storing token:', storageError);
        throw storageError;
      }

      // Register device token
      try {
        const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Registering device token:', expoPushToken);

        await axios.post(
          `${apiUrl}/update-device-token`,
          { device_token: expoPushToken },
          {
            headers: {
              Authorization: `Bearer ${user_token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        console.log('Device token registered');
        
      } catch (tokenError) {
        console.error('Error registering device token:', tokenError);
        // Continue with login even if token registration fails
      }

      // Dispatch login success with all required data
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          access_token: user_token, // Make sure this matches the reducer's expected property name
          refresh_token,
          permission,
          isAuthenticated: true
        }
      });

      console.log('Dispatched LOGIN_SUCCESS with isAuthenticated:', true);

      return {
        user,
        user_token,
        refresh_token,
        permission,
        isAuthenticated: true
      };

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        error: errorMessage
      });
      return {
        error: errorMessage,
        isAuthenticated: false
      };
    }
  };

  logoutUser = async (dispatch) => {
    try {
      console.log('Starting logout process');
      const user_token = await AsyncStorage.getItem('access_token');
      console.log('User token from storage:', user_token);
      
      // Log all items in AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All AsyncStorage Keys:', allKeys);
      
      // Log values for each key
      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`AsyncStorage ${key}:`, value);
      }
      
      try {
        if (!user_token) {
          console.log('No user token found in storage');
          return;
        }
        // Get the current Expo push token
        const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Current device token to remove:', expoPushToken);

        // Remove the device token
        const response = await axios.post(
          `${apiUrl}/remove-device-token`,
          { device_token: expoPushToken },
          {
            headers: { 
              'Authorization': `Bearer ${user_token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        console.log('Server response for token removal:', response.data);

        // Clear stored tokens
        await AsyncStorage.removeItem('access_token');
        console.log('Removed access token from storage');

        // Also clear the device token from storage if you're storing it
        await AsyncStorage.removeItem('device_token');
        console.log('Removed device token from storage');

        await AsyncStorage.removeItem('refresh_token');
        console.log('Removed refresh token from storage');

      } catch (tokenError) {
        console.error('Error removing device token:', tokenError.response?.data || tokenError.message);
        // If device token removal fails, still clear local storage
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('device_token');
        await AsyncStorage.removeItem('refresh_token');
      }

      dispatch({
        type: 'LOGOUT'
      });
      console.log('Dispatched logout action');

    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout even if there's an error
      dispatch({
        type: 'LOGOUT'
      });
    }
  };

  userPermission = (permission = "", auth) => {
    try {
      if ((auth?.rolePermission).includes(permission)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  };

  userRole = (role_name = "", auth) => {
    try {
      if (auth?.role === role_name) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Role check failed:', error);
      return false;
    }
  };
}

export default AuthActions;