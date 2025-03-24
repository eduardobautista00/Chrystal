import * as SecureStore from 'expo-secure-store';

export const AuthStorage = {
  storeToken: async (token) => {
    try {
      await SecureStore.setItemAsync('access_token', token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
        requireAuthentication: false,
        authenticationPrompt: 'Please authenticate to access the app',
      });
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },

  getToken: async () => {
    try {
      return await SecureStore.getItemAsync('access_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  removeToken: async () => {
    try {
      await SecureStore.deleteItemAsync('access_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
}; 