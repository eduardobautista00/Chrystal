import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
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

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { authState } = useAuth();
  const { apiUrl } = getEnvVars();
  const [currentTime, setCurrentTime] = useState(moment());

  const saveNotificationsDebounced = debounce((updatedNotifications) => {
    AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  }, 500);

  const processNotification = (data) => {
    const validatedNotification = {
      ...data,
      deadline: data.deadline && moment(data.deadline, 'MMMM D, YYYY h:mm A', true).isValid()
        ? moment(data.deadline, 'MMMM D, YYYY h:mm A')
        : null,
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
      const sortedNotifications = data.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));

      setNotifications(sortedNotifications);
      await AsyncStorage.setItem('notifications', JSON.stringify(sortedNotifications));
    } catch (error) {
      console.error('Error fetching notifications:', error);
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

  const channel = pusher.subscribe(`agent.${authState.user.id}`);

  channel.bind('todo-notif', async (data) => {
    console.log('Pusher Notification received:', data);
    
    // Process and store notification
    processNotification(data);

    // 🔔 Trigger a local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title || 'New Notification',
        body: data.message || 'You have a new notification.',
        data: data, // Store full notification data
      },
      trigger: null, // Show immediately
    });
  });

  return () => {
    //channel.unbind_all();
    //pusher.unsubscribe(`agent.${authState.user.id}`);
  };
}, [authState?.user?.id]);

useEffect(() => {
  const backgroundListener = Notifications.addNotificationReceivedListener(async (notification) => {
    console.log('Background notification received:', notification);

    // Process and store notification
    processNotification(notification.request.content.data);
  });

  return () => {
    Notifications.removeNotificationSubscription(backgroundListener);
  };
}, []);

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

  const renderNotification = ({ item }) => {
    const timeAgo = moment(item.created_at).local().fromNow();
    const isRead = item.status === 'read';

    return (
      <TouchableOpacity
        style={[styles.notificationContainer, isRead ? styles.readNotification : styles.unreadNotification]}
        onPress={() => handleNotificationPress(item.id)}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={[styles.timeAgo, isRead ? styles.readTimeAgo : styles.unreadTimeAgo]}>
            {timeAgo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item, index) => item.id ? item.id.toString() : `key-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications available</Text>}
      />
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
  {selectedNotification && (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
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
