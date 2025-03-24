import React, { useEffect } from "react";
import React, { useEffect } from "react";
import { Provider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContextProvider } from './app/context/AuthContext';
import { DataContextProvider } from './app/context/DataContext';
import Navigation from './app/navigation/AppNavigator';
import { theme } from "./app/core/theme";
import { navigationRef } from './app/navigation/NavigationService';
import { checkAuthStatus } from './app/utils/authUtils';
import { DarkModeProvider } from './app/context/DarkModeContext';

export default function App() {
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     // Wait for navigation to be ready
  //     setTimeout(async () => {
  //       await checkAuthStatus(navigationRef.current);
  //     }, 100);
  //   };
  //   checkAuth();
  // }, []);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     // Wait for navigation to be ready
  //     setTimeout(async () => {
  //       await checkAuthStatus(navigationRef.current);
  //     }, 100);
  //   };
  //   checkAuth();
  // }, []);

  return (
    <Provider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "right", "left"]}>
          <NavigationContainer ref={navigationRef}>
            <AuthContextProvider>
              <DataContextProvider>
                <DarkModeProvider>
                  <Navigation />
                </DarkModeProvider>
              </DataContextProvider>
            </AuthContextProvider>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}