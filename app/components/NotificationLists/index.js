import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';
import { useAuth } from "../../context/AuthContext";
import Pusher from 'pusher-js/react-native';
import moment from 'moment/moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../config/env';
import debounce from 'lodash/debounce';

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

  useEffect(() => {
    if (!authState?.user?.id) {
      console.error('User ID not found in authState');
      return;
    }

    const fetchNotifications = async () => {
      if (!notifications.length) {  // Only fetch if notifications list is empty
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
          console.log('Fetched Notifications:', data);
    
          const fetchedNotifications = (data || []).map((notification) => {
            if (notification.deadline && !moment(notification.deadline, moment.ISO_8601, true).isValid()) {
              console.warn(`Invalid date format for notification ID: ${notification.id}, deadline: ${notification.deadline}`);
              notification.deadline = null;
            }
            return notification;
          });
    
          // Sort notifications by created_at (ascending order)
          const sortedNotifications = fetchedNotifications.sort((a, b) => {
            const dateA = moment(a.created_at);
            const dateB = moment(b.created_at);
            return dateA.isBefore(dateB) ? 1 : -1; // Sort in ascending order
          });
    
          setNotifications(sortedNotifications);
    
          await AsyncStorage.setItem('notifications', JSON.stringify(sortedNotifications));
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications');
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
    
          // Remove duplicates based on the notification id
          const uniqueNotifications = Array.from(new Set(parsedNotifications.map(a => a.id)))
            .map(id => parsedNotifications.find(a => a.id === id));
    
          setNotifications(uniqueNotifications);
        }
        await fetchNotifications();
      } catch (error) {
        console.error('Error loading notifications from AsyncStorage:', error);
      }
    };
    loadNotifications()

    const saveNotificationsDebounced = debounce((updatedNotifications) => {
      AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    }, 500);

    const pusher = new Pusher('b146fd66074ecc4f8ea4', {
      cluster: 'ap1',
      encrypted: true,
    });

    const channelName = `agent.${authState.user.id}`;
    const channel = pusher.subscribe(channelName);

    channel.bind('todo-notif', (data) => {
      console.log('Notification received:', data);
    
      const validatedNotification = {
        ...data,
        deadline: data.deadline
          ? moment(data.deadline, 'MMMM D, YYYY h:mm A', true).isValid()
            ? moment(data.deadline, 'MMMM D, YYYY h:mm A')
            : null
          : null,
      };
    
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.filter(
          (notification) => notification.id !== validatedNotification.id // Prevent duplicates
        );
        updatedNotifications.unshift(validatedNotification); // Add new notification at the start
    
        // Ensure there are no duplicates in the updatedNotifications array
        const uniqueNotifications = Array.from(new Set(updatedNotifications.map(a => a.id)))
          .map(id => updatedNotifications.find(a => a.id === id));
    
        saveNotificationsDebounced(uniqueNotifications);
        return uniqueNotifications;
      });
    });
    

    return () => {
      // Cleanup
    };
  }, [authState?.user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationPress = (notificationId) => {
    const selectedNotification = notifications.find((item) => item.id === notificationId);
    setSelectedNotification(selectedNotification);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const renderNotification = ({ item }) => {
    const timeAgo = moment(item.created_at, moment.ISO_8601, true).local().fromNow();

    return (
      <TouchableOpacity style={styles.notificationContainer} onPress={() => handleNotificationPress(item.id)}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>●</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderModalContent = () => {
    if (!selectedNotification) return null;

    const deadlineDate = selectedNotification.deadline
      ? moment(selectedNotification.deadline, moment.ISO_8601, true)
      : null;

    if (!deadlineDate || !deadlineDate.isValid()) {
      return (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
            <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
            <Text style={styles.modalMessage}>Deadline not available.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const formattedDate = deadlineDate.format('MMMM D, YYYY');
    const formattedTime = deadlineDate.format('h:mm A');

    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
          <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
          <View style={styles.modalDeadline}>
            <Text style={styles.modalDeadlineText}>Deadline:</Text>
            <View style={styles.modalDeadlineDetails}>
              <Text style={styles.modalDeadlineLabel}>Day:</Text>
              <Text style={styles.modalDeadlineValue}>{formattedDate}</Text>
            </View>
            <View style={styles.modalDeadlineDetails}>
              <Text style={styles.modalDeadlineLabel}>Time:</Text>
              <Text style={styles.modalDeadlineValue}>{formattedTime}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        {renderModalContent()}
      </Modal>
    </View>
  );
}
