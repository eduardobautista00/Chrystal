import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the saved dark mode state when the component mounts
  useEffect(() => {
    const loadSavedMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('darkMode');
        if (savedMode !== null) {
          setIsDarkMode(JSON.parse(savedMode));
        }
      } catch (error) {
        console.error('Error loading dark mode state:', error);
      }
    };
    loadSavedMode();
  }, []);

  // Save to AsyncStorage whenever isDarkMode changes
  useEffect(() => {
    const saveMode = async () => {
      try {
        await AsyncStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      } catch (error) {
        console.error('Error saving dark mode state:', error);
      }
    };
    saveMode();
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext); 