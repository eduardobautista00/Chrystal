import React from "react";
import { Provider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContextProvider } from './app/context/AuthContext';
import { DataContextProvider } from './app/context/DataContext';
import Navigation from './app/navigation/AppNavigator';
import { theme } from "./app/core/theme";
import { navigationRef } from './app/navigation/NavigationService';

export default function App() {
  return (
    <Provider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "right", "left"]}>
          <NavigationContainer ref={navigationRef}>
            <AuthContextProvider>
              <DataContextProvider>
                <Navigation />
              </DataContextProvider>
            </AuthContextProvider>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}