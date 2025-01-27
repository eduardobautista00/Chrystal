
import React, { createContext, useState, useEffect , useReducer , useContext } from 'react';
// import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { rootAuthReducer, initialAuthState } from '../store/reducers';
import AuthActions from '../store/actions/authActions';

import getEnvVars from '../config/env';

const { apiUrl } = getEnvVars();


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
 
  const authActions = new AuthActions();

  const [authState, authDispatch] = useReducer(rootAuthReducer, initialAuthState);
  
  
  const navigation = useNavigation();

  // useEffect(() => {

  //   checkUserAuthentication ();
  //   console.log(authState , "useEffectAuthContext");
  // }, [authState]);
  const create = async (userInfo) => authActions.registerUser(authDispatch, userInfo);

  const register = async (agentInfo) => {
    console.log(authState);
    // authActions.registerAgent(authDispatch, agentInfo)
  };


  const login = async (email, password) => authActions.loginUser(authDispatch, email, password);

  const logout = async () => {
    removeToken();
    authActions.logoutUser(authDispatch);
    navigation.navigate("StartScreen");

  }

  const hasCan = (permission = "" ) => authActions.userPermission(permission , authState);

  const isRole = (role = "" ) => authActions.userRole(role  , authState);

  useEffect(  () => {

    // console.log(authState , "useEffectuseEffectuseEffect");

    
    
    if (authState.token) {
        checkUserAuthentication();
        // Set up interval to check authentication every 5 minutes
        const interval = setInterval(checkUserAuthentication, 5 * 60 * 1000);
    
        // Clean up interval on unmount
        return () => clearInterval(interval);
    }
    
    
  }, [authState , login]);



  const removeToken  = async () => {
    console.log("remove TOken")
    try {
      await AsyncStorage.removeItem('accessToken');
      console.log('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const checkUserAuthentication  = async () => {
    try {
      // const token = await SecureStore.getItemAsync('accessToken');

     
      const token = authState.token;
        //console.error(token, "authState.token");
        // console.log("%c " + token, "color:green;");
     

      if (token) {

        AsyncStorage.setItem("accessToken",token);
        const response = await fetch(`${apiUrl}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          console.log(response , checkUserAuthentication)
          
          
        } else {
          throw new Error('Failed to fetch user data');
          // authActions.logoutUser(authDispatch)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // authActions.logoutUser(authDispatch);
      
    }
  };

  

  return (
    <AuthContext.Provider value={{authState : { ...authState , login , register , create, logout , hasCan , isRole}}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
