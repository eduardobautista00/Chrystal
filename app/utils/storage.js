import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAllAppData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
}; 