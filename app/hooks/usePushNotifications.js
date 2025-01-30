import { useEffect } from "react";
import * as Notifications from 'expo-notifications';

export default function usePushNotifications() {
  useEffect(() => {
    const registerForPushNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Push notifications permission not granted');
        return;
      }
      
      // Get the device token
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push notification token:', token);
      
      // Save the token to your backend or Firebase if needed
    };

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received in foreground:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
    });

    registerForPushNotifications();

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}
