import React, { createContext, useReducer, useContext } from 'react';
// import { Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { registerStateReducer, registerInitialState } from '../store/statemodel/registerUserStateReducer';
import { resetPasswordOtpStateReducer, resetPasswordOtpInitialState } from '../store/statemodel/resetPasswordOtpStateReducer';
import { otpStateReducer, otpInitialState } from '../store/statemodel/otpStateReducer';
import { resetPasswordStateReducer, resetPasswordInitialState } from '../store/statemodel/resetPasswordStateReducer';
import { propertyStateReducer, propertyInitialState } from '../store/statemodel/propertyStateReducer';
import axios from 'axios';
import getEnvVars from '../config/env';

const { apiUrl } = getEnvVars();

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {

  /* Property Action */
  const [propertyState, addPropertyDispatch] = useReducer(propertyStateReducer, propertyInitialState);

  /* Register Action */
  const [registerState, registerDispatch] = useReducer(registerStateReducer, registerInitialState);
  const [resetPasswordOtpState, resetPasswordOtpDispatch] = useReducer(resetPasswordOtpStateReducer, resetPasswordOtpInitialState);
  const [otpState, otpDispatch] = useReducer(otpStateReducer, otpInitialState);
  const [resetPasswordState, resetPasswordDispatch] = useReducer(resetPasswordStateReducer, resetPasswordInitialState);



  //const registerUser = (data) => registerDispatch({ type: 'REGISTER_REQUEST' });

  // Register user function
  const registerUser = (data) => {
    console.log("Registering user with data:", data); // Log the data being sent
    registerDispatch({ type: 'REGISTER_REQUEST' });
  
    fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Full API response:", responseData); // Log the full response to examine its structure
  
        // Check for success based on the message as a fallback
        if (responseData.success || responseData.message === "User registered successfully") {
          const userData = responseData.data || responseData.user || responseData.result;
          if (userData) {
            registerDispatch({ type: 'REGISTER_SUCCESS',  payload: responseData.user });
            console.log("Registration successful, user data:", responseData.user);
          } else {
            console.warn("Registration succeeded but user data is missing in the response.");
            registerDispatch({ type: 'REGISTER_SUCCESS', payload: null });
          }
        } else {
          console.warn("Registration failed with message:", responseData.message);
          registerDispatch({ type: 'REGISTER_FAILURE', payload: responseData.message });
        }
      })
      .catch((error) => {
        console.error("Registration error:", error.message); // Log any network or unexpected errors
        registerDispatch({ type: 'REGISTER_FAILURE', payload: error.message });
      });
  };
  
  

  // Register agent function
  const registerAgent = (agentInfo) => {
    registerDispatch({ type: 'REGISTER_REQUEST' });

    // Call your API for agent registration
    fetch(`${apiUrl}/register-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentInfo),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Full API response:", responseData); // Log the full response to examine its structure
        if (responseData.success) {
          registerDispatch({ type: 'REGISTER_SUCCESS', payload: responseData.data });
        } else {
          registerDispatch({ type: 'REGISTER_FAILURE', payload: responseData.message });
        }
      })
      .catch((error) => {
        registerDispatch({ type: 'REGISTER_FAILURE', payload: error.message });
      });
  };


  const resetPasswordOTP = async (email) => {
    resetPasswordOtpDispatch({ type: 'RESET_PASSWORDOtp_REQUEST' });
  
    try {
      const response = await fetch(`${apiUrl}/password-reset/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        const errorMessage = `HTTP Error: ${response.status}`;
        if (response.status === 404) {
          console.error('API Endpoint not found. Please check the URL.');
        }
        console.error(errorMessage);
        resetPasswordDispatch({
          type: 'RESET_PASSWORDOtp_FAILURE',
          payload: errorMessage,
        });
        return { error: errorMessage };
      }
  
      // Parse the response body once
      const responseData = await response.json();
  
      console.log("Full API response for reset password:", responseData);
      console.log("Full API response for reset password:", responseData.message);
  
      // Check for the success message
      if (responseData && responseData.message === 'OTP sent to your email.') {
        resetPasswordDispatch({ type: 'RESET_PASSWORDOtp_SUCCESS' });
        console.log("Password reset email sent successfully.");
  
        // If successful, return response data and trigger navigation
        return responseData;  // Returning the data is important to trigger further logic in the calling function
      } else {
        const errorMessage = responseData.message || "Unexpected error: could not send reset link.";
        console.warn("Password reset failed:", errorMessage);
        resetPasswordDispatch({
          type: 'RESET_PASSWORDOtp_FAILURE',
          payload: errorMessage,
        });
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Password reset error:", error.message);
      resetPasswordDispatch({
        type: 'RESET_PASSWORDOtp_FAILURE',
        payload: error.message,
      });
      return { error: error.message };
    }
  };
  
  const verifyOtp = async (email, otp) => {
    console.log("Received OTP in verifyOtp:", otp);
    otpDispatch({ type: 'OTP_VERIFICATION_REQUEST' });
  
    try {
      const response = await fetch(`${apiUrl}/password-reset/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }), 
      });
  
      if (!response.ok) {
        const errorMessage = `HTTP Error: ${response.status}`;
        console.error(errorMessage);
        otpDispatch({ type: 'OTP_VERIFICATION_FAILURE', payload: errorMessage });
        return { error: errorMessage };
      }
  
      const responseData = await response.json();
      console.log("OTP verification response:", responseData);
  
      // Handle response based on the "status" field
      if (responseData && responseData.message === 'OTP verified successfully.') {
        otpDispatch({ type: 'OTP_VERIFICATION_SUCCESS' });
        return responseData; // Return success with the message
      } else {
        const errorMessage = responseData.message || "Verification failed.";
        otpDispatch({ type: 'OTP_VERIFICATION_FAILURE', payload: errorMessage });
        return { error: errorMessage }; // Treat the message as error in case of failure
      }
    } catch (error) {
      console.error("OTP verification error:", error.message);
      otpDispatch({ type: 'OTP_VERIFICATION_FAILURE', payload: error.message });
      return { error: error.message };
    }
  };

  const resetPassword = async (email, otp, password, password_confirmation) => {
    resetPasswordOtpDispatch({ type: 'RESET_PASSWORD_REQUEST' });
  
    try {
      const response = await fetch(`${apiUrl}/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, password, password_confirmation }),
      });
  
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        const errorMessage = `HTTP Error: ${response.status}`;
        console.error(errorMessage);
        resetPasswordOtpDispatch({
          type: 'RESET_PASSWORD_FAILURE',
          payload: errorMessage,
        });
        return { error: errorMessage };
      }
  
      // Parse the response body once
      const responseData = await response.json();
      console.log("Full API response for reset password:", responseData);
  
      // Check for the success message
      if (responseData && responseData.message === 'Password reset successfully.') {
        resetPasswordOtpDispatch({ type: 'RESET_PASSWORD_SUCCESS' });
        console.log("Password reset successfully.");
        return responseData;  // Returning the data is important to trigger further logic in the calling function
      } else {
        const errorMessage = responseData.message || "Unexpected error: could not reset password.";
        console.warn("Password reset failed:", errorMessage);
        resetPasswordOtpDispatch({
          type: 'RESET_PASSWORD_FAILURE',
          payload: errorMessage,
        });
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Password reset error:", error.message);
      resetPasswordOtpDispatch({
        type: 'RESET_PASSWORD_FAILURE',
        payload: error.message,
      });
      return { error: error.message };
    }
  };

  const addProperty = async (formDataToSubmit) => {
    addPropertyDispatch({ type: 'ADD_PROPERTY_REQUEST' });
  
    try {
      console.log("API URL being used:", `${apiUrl}/create-properties`);
      console.log("Property data:", formDataToSubmit);
  
      const response = await axios.post(`${apiUrl}/create-properties`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${authState.token}`, // If you need an auth token
        },
        timeout: 30000, // Set timeout to 30 seconds to avoid unnecessary timeouts
      });
  
      console.log("API response:", response);
  
      if (response.data && response.data.success) {
        console.log('Add property success:', response.data);
        addPropertyDispatch({
          type: 'ADD_PROPERTY_SUCCESS',
          payload: response.data.data,
        });
        return response.data;
      } else {
        const errorMessage = response.data.message || 'Property creation failed.';
        //console.warn('Add property failed:', errorMessage);
        addPropertyDispatch({
          type: 'ADD_PROPERTY_FAILURE',
          payload: errorMessage,
        });
        return { error: errorMessage };
      }
    } catch (error) {
      // Log error details
      console.error('Add property error:', error.message);
      if (error.response) {
        console.error('Response error data:', error.response.data);
      }
      if (error.request) {
        console.error('Request error details:', error.request);
      }
      addPropertyDispatch({
        type: 'ADD_PROPERTY_FAILURE',
        payload: error.message,
      });
      return { error: error.message };
    }
  };
  
  
  

  
  
  
  
  

  return (
    <DataContext.Provider
      value={{
        property: {
          ...{propertyState},
          addProperty,
          //removeProperty,
        },
        register: {
          ...{registerState},
          registerUser,
          registerAgent,
        },
        resetPasswordOtp: {
          ...{resetPasswordOtpState},
          resetPasswordOTP,
        },
        verifyOtp: {
          ...{otpState},
          verifyOtp,
        },
        resetPassword: {
          ...{resetPasswordState},
          resetPassword,
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataContextProvider');
  }
  return context;
};
