import React, { useEffect, useState } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContextProvider } from './app/context/AuthContext';
import { DataContextProvider } from './app/context/DataContext';
import Navigation from './app/navigation/AppNavigator';
import { theme } from "./app/core/theme";
import { navigationRef } from './app/navigation/NavigationService';
import { registerForPushNotificationsAsync } from './app/utils/notificationsHelper'; // Import the helper function
import * as Notifications from "expo-notifications";

export default function App() {
  // const [expoPushToken, setExpoPushToken] = useState("");

  // useEffect(() => {
  //   // Register for push notifications
  //   const registerNotifications = async () => {
  //     const token = await registerForPushNotificationsAsync();
  //     setExpoPushToken(token); // Save the token for use later (e.g., send to server)
  //   };

  //   registerNotifications();

  //   // Set up notification listeners (optional)
  //   const notificationListener = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       console.log("Notification received in foreground:", notification);
  //     }
  //   );

  //   const responseListener = Notifications.addNotificationResponseReceivedListener(
  //     (response) => {
  //       console.log("User interacted with notification:", response);
  //     }
  //   );

  //   // Cleanup listeners on unmount
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener);
  //     Notifications.removeNotificationSubscription(responseListener);
  //   };
  // }, []);

  return (
    <Provider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <AuthContextProvider>
          <DataContextProvider>
            <Navigation />
          </DataContextProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </Provider>
  );
}
