import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { useAuth } from "../../context/AuthContext";
import Pusher from 'pusher-js/react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../config/env';
import debounce from 'lodash/debounce';
import * as Notifications from 'expo-notifications';

moment.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    ss: "%d seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export default function NotificationList({ isDarkMode }) {
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { authState } = useAuth();
  const { apiUrl } = getEnvVars();
  const [currentTime, setCurrentTime] = useState(moment());
  const [loading, setLoading] = useState(true);

  const saveNotificationsDebounced = debounce((updatedNotifications) => {
    AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  }, 500);

  const processNotification = (data) => {
    console.log('Processing notification data:', data);
    console.log('Processing notification data:', data);
    const validatedNotification = {
      ...data,
      deadline: data.deadline && moment(data.deadline, 'MMMM D, YYYY h:mm A', true).isValid()
        ? moment(data.deadline, 'MMMM D, YYYY h:mm A')
        : null,
      type: data.type || 'regular',
      type: data.type || 'regular',
    };

    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notification) => notification.id !== validatedNotification.id
      );
      updatedNotifications.unshift(validatedNotification);

      const uniqueNotifications = Array.from(new Set(updatedNotifications.map(a => a.id)))
        .map(id => updatedNotifications.find(a => a.id === id));

      saveNotificationsDebounced(uniqueNotifications);
      return uniqueNotifications;
    });
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${apiUrl}/notifications`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching notifications: ${response.status}`);
      }

      const data = await response.json();
      // Filter notifications for the logged-in user
      const userNotifications = data.filter(notification => notification.user_id === authState.user.id);
      const sortedNotifications = userNotifications.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));
      // Filter notifications for the logged-in user
      const userNotifications = data.filter(notification => notification.user_id === authState.user.id);
      const sortedNotifications = userNotifications.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));

      setNotifications(sortedNotifications);
      await AsyncStorage.setItem('notifications', JSON.stringify(sortedNotifications));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authState?.user?.id) {
      console.error('User ID not found in authState');
      return;
    }

    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications');
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
        await fetchNotifications();
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();

    // Initialize Pusher
    const pusher = new Pusher('b146fd66074ecc4f8ea4', {
      cluster: 'ap1',
      encrypted: true,
    });
    const pusher = new Pusher('b146fd66074ecc4f8ea4', {
      cluster: 'ap1',
      encrypted: true,
    });

    const channel = pusher.subscribe(`agent.${authState.user.id}`);
    const channel1 = pusher.subscribe(`property.${authState.user.id}`);

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        const currentBadge = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(currentBadge + 1);
        
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          icon: 'assets/Notification-icon.png'
        };
      },
    });

    // Listen for notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      processNotification(notification.request.content.data);
    });

    // Add background notification listener
    const backgroundListener = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log('Background notification received:', notification);
      // Process and store notification
      processNotification(notification.request.content.data);
    });

    channel.bind('todo-notif', async (data) => {
      console.log('Pusher Notification received:', data);
      processNotification(data);
      await scheduleNotification(data);
    });

    channel1.bind('approve-notif', async (data) => {
      console.log('Pusher Approval Notification received:', data);
      processNotification(data);
      await scheduleNotification(data);
    });
    const channel = pusher.subscribe(`agent.${authState.user.id}`);
    const channel1 = pusher.subscribe(`property.${authState.user.id}`);

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        const currentBadge = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(currentBadge + 1);
        
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          icon: 'assets/Notification-icon.png'
        };
      },
    });

    // Listen for notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      processNotification(notification.request.content.data);
    });

    // Add background notification listener
    const backgroundListener = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log('Background notification received:', notification);
      // Process and store notification
      processNotification(notification.request.content.data);
    });

    channel.bind('todo-notif', async (data) => {
      console.log('Pusher Notification received:', data);
      processNotification(data);
      await scheduleNotification(data);
    });

    channel1.bind('approve-notif', async (data) => {
      console.log('Pusher Approval Notification received:', data);
      processNotification(data);
      await scheduleNotification(data);
    });

    return () => {
      // Clean up listeners
      subscription.remove();
      Notifications.removeNotificationSubscription(backgroundListener);
      //channel.unbind_all();
      //pusher.unsubscribe(`agent.${authState.user.id}`);
    };
  }, [authState?.user?.id]);
    return () => {
      // Clean up listeners
      subscription.remove();
      Notifications.removeNotificationSubscription(backgroundListener);
      //channel.unbind_all();
      //pusher.unsubscribe(`agent.${authState.user.id}`);
    };
  }, [authState?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(fetchNotifications, 1000);
      return () => clearInterval(interval);
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(moment()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationPress = (notificationId) => {
    const selectedNotification = notifications.find((item) => item.id === notificationId);
    setSelectedNotification(selectedNotification);
    setIsModalVisible(true);
    markNotificationAsRead(notificationId);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${apiUrl}/notifications/${notificationId}/mark-as-read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error marking notification as read: ${response.status}`);
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, status: 'read' } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const scheduleNotification = async (data) => {
    const notificationTitle = data.type === 'follow-up' 
      ? `Follow-up: ${data.title}` 
      : data.title || 'New Notification';
      
    const notificationBody = data.type === 'approve' 
      ? data.message 
      : `Your task for ${data.message} is due tomorrow`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationTitle,
        body: notificationBody || 'You have a new notification.',
        data: data, // Store full notification data
      },
      trigger: null, // Show immediately
    });
  };

  // Commented out the sample notification function for testing
  /*
  const sendSampleNotification = async () => {
    const sampleData = {
      title: "Sample Notification",
      message: "This is a test notification to check if everything is working.",
      // Add any other data you want to include
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: sampleData.title,
        body: sampleData.message,
        data: sampleData, // Store full notification data
      },
      trigger: null, // Show immediately
    });

    console.log('Sample notification sent');
  };
  */

  const scheduleNotification = async (data) => {
    const notificationTitle = data.type === 'follow-up' 
      ? `Follow-up: ${data.title}` 
      : data.title || 'New Notification';
      
    const notificationBody = data.type === 'approve' 
      ? data.message 
      : `Your task for ${data.message} is due tomorrow`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationTitle,
        body: notificationBody || 'You have a new notification.',
        data: data, // Store full notification data
      },
      trigger: null, // Show immediately
    });
  };

  // Commented out the sample notification function for testing
  /*
  const sendSampleNotification = async () => {
    const sampleData = {
      title: "Sample Notification",
      message: "This is a test notification to check if everything is working.",
      // Add any other data you want to include
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: sampleData.title,
        body: sampleData.message,
        data: sampleData, // Store full notification data
      },
      trigger: null, // Show immediately
    });

    console.log('Sample notification sent');
  };
  */

  const renderNotification = ({ item }) => {
    const timeAgo = moment(item.created_at).local().fromNow();
    const isRead = item.status === 'read';
    const displayTitle = item.type === 'follow-up' ? `Follow-up: ${item.title}` : item.title;
    const displayTitle = item.type === 'follow-up' ? `Follow-up: ${item.title}` : item.title;

    return (
      <TouchableOpacity
        style={[
          styles.notificationContainer,
          !isDarkMode ? (isRead ? styles.readNotification : styles.unreadNotification) :
          (isRead ? styles.darkModeReadNotification : styles.darkModeNotification)
        ]}
        onPress={() => handleNotificationPress(item.id)}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>{displayTitle}</Text>
          <Text style={[styles.timeAgo, isRead ? styles.readTimeAgo : styles.unreadTimeAgo, isDarkMode && { color: '#fff' }]}>
            {timeAgo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#1A1A1A' }]}>
      <Text style={[styles.header, isDarkMode && { color: '#fff' }]}>Notifications</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B61FF" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) => item.id ? item.id.toString() : `key-${index}`}
          ListEmptyComponent={<Text style={[styles.emptyText, isDarkMode && { color: '#fff' }]}>No notifications available</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* Commented out the button to send a sample notification */}
      {/* <Button title="Send Sample Notification" onPress={sendSampleNotification} /> */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        {selectedNotification && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedNotification.type === 'follow-up' 
                  ? `Follow-up: ${selectedNotification.title}`
                  : selectedNotification.title}
              </Text>
              <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
              {selectedNotification.deadline && (
                <View style={styles.deadlineContainer}>
                  <Text style={styles.modalDeadlineText}>Deadline:</Text>
                  <Text style={styles.modalDeadlineLabel}>
                    Date: {moment(selectedNotification.deadline).format('MMM D, YYYY')}
                  </Text>
                  <Text style={styles.modalDeadlineLabel}>
                    Time: {moment(selectedNotification.deadline).format('h:mm a')}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
        {selectedNotification && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedNotification.type === 'follow-up' 
                  ? `Follow-up: ${selectedNotification.title}`
                  : selectedNotification.title}
              </Text>
              <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
              {selectedNotification.deadline && (
                <View style={styles.deadlineContainer}>
                  <Text style={styles.modalDeadlineText}>Deadline:</Text>
                  <Text style={styles.modalDeadlineLabel}>
                    Date: {moment(selectedNotification.deadline).format('MMM D, YYYY')}
                  </Text>
                  <Text style={styles.modalDeadlineLabel}>
                    Time: {moment(selectedNotification.deadline).format('h:mm a')}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
