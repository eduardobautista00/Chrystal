import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from "../config/env";

const { apiUrl } = getEnvVars();

export const refreshToken = async () => {
    try {
        console.log('Starting token refresh process');
        const refresh_token = await AsyncStorage.getItem('refresh_token');
        console.log('Retrieved refresh token:', refresh_token ? 'exists' : 'null');

        if (!refresh_token) {
            console.log('No refresh token found');
            return null; // No refresh token found, force logout
        }

        console.log('Attempting to fetch new access token');
        const response = await fetch(`${apiUrl}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token }),
        });

        const data = await response.json();
        console.log('Refresh token response:', data);

        if (data.access_token) {
            await AsyncStorage.setItem('access_token', data.access_token);
            console.log('Successfully stored new access token');
            return data.access_token;
        } else {
            console.log('Refresh failed - no access token in response');
            return null; // Handle refresh failure
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
};

export const checkAuthStatus = async (navigation, setAuth) => {
    console.log('Starting checkAuthStatus...');
    
    try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Initial access token check:', token ? 'exists' : 'null');
        
        const refreshTokenValue = await AsyncStorage.getItem('refreshToken');
        console.log('Refresh token check:', refreshTokenValue ? 'exists' : 'null');

        if (token && token.split('.').length === 3) {
            console.log('Token appears valid, proceeding to dashboard');
            // Update the auth state first
            if (setAuth) {
                await setAuth(token);
                console.log('Auth state updated:', authState);
                navigation.navigate('Dashboard');
            }
            return true;
        } else {
            console.log('Token invalid or missing');
            return false;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
};
