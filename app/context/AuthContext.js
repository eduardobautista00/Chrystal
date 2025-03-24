import React, { createContext, useState, useEffect, useReducer, useContext, useCallback } from 'react';
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
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        token: null,
        user: null,
        role: null,
        rolePermission: [],
        isLoading: false,
        error: null,
    });

    const authActions = new AuthActions();
    const [reducerState, authDispatch] = useReducer(rootAuthReducer, initialAuthState);
    const navigation = useNavigation();

    const setAuthenticated = async (token) => {
        console.log('Setting authenticated state with token:', token);
        try {
            await AsyncStorage.setItem('access_token', token);
            
            // Decode the JWT token to get the user email
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            const userEmail = payload.email;
            
            // Fetch users data with the token
            const response = await fetch(`${apiUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const users = await response.json();
                console.log('Users data fetched:', users);
                
                // Find the current user based on email from token
                const currentUser = users.find(user => user.email === userEmail);
                
                if (!currentUser) {
                    throw new Error('User not found');
                }
                
                console.log('Current user:', currentUser);
                // Extract role and permissions from the user data structure
                const userRole = currentUser.roles?.[0]?.name || null;
                const userPermissions = currentUser.roles?.[0]?.permission || [];
                
                console.log('Extracted role:', userRole);
                console.log('Extracted permissions:', userPermissions);
                
                setAuthState(prev => ({
                    ...prev,
                    isAuthenticated: true,
                    token: token,
                    user: currentUser,
                    role: userRole,
                    rolePermission: userPermissions,
                    isLoading: false,
                    error: null
                }));
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error setting authentication:', error);
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: false,
                token: null,
                user: null,
                role: null,
                rolePermission: [],
                isLoading: false,
                error: error.message
            }));
        }
    };

    // useEffect(() => {

    //   checkUserAuthentication ();
    //   console.log(authState , "useEffectAuthContext");
    // }, [authState]);
    const create = async (userInfo) => authActions.registerUser(authDispatch, userInfo);

    const register = async (agentInfo) => authActions.registerAgent(authDispatch, agentInfo);

    const login = async (email, password) => {
        try {
            const response = await authActions.loginUser(authDispatch, email, password);
            
            if (response.isAuthenticated) {
                // Update the local auth state
                setAuthState(prevState => ({
                    ...prevState,
                    isAuthenticated: true,
                    token: response.user_token,
                    user: response.user,
                    role: response.user.role_name,
                    rolePermission: response.permission,
                    isLoading: false,
                    error: null
                }));
            }
            
            return response;
        } catch (error) {
            console.error('Login error in context:', error);
            setAuthState(prevState => ({
                ...prevState,
                isAuthenticated: false,
                error: error.message
            }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authActions.logoutUser(authDispatch);
            // Update local state as well
            setAuthState({
                isAuthenticated: false,
                token: null,
                user: null,
                role: null,
                rolePermission: [],
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const hasCan = useCallback((permission) => {
        return authState.rolePermission && authState.rolePermission.includes(permission);
    }, [authState.rolePermission]);

    const isRole = useCallback((roleName) => {
        return authState.role === roleName;
    }, [authState.role]);

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
            console.log("authState",authState);
            console.log(authState.token , "authState.token");
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
            //console.error('Error fetching user data:', error);
            // authActions.logoutUser(authDispatch);
        }
    };

    return (
        <AuthContext.Provider value={{
            authState,
            setAuthenticated,
            login,
            logout,
            register,
            create,
            hasCan,
            isRole
        }}>
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
