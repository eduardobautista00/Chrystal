import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons for simple icons
import styles from './styles';

const BottomNavigation = ({ isDarkMode }) => {
  const navigation = useNavigation();
  const [currentRoute, setCurrentRoute] = useState(navigation.getState().routes[navigation.getState().index].name);

  console.log('currentRoute', currentRoute);
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setCurrentRoute(navigation.getState().routes[navigation.getState().index].name);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.bottomNav, isDarkMode && { backgroundColor: '#1A1A1A' }]}>
      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'ProfileScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('ProfileScreen')}
        style={[styles.navButton, currentRoute === 'ProfileScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text>
          <MaterialIcons 
            name="home" 
            size={24} 
            color={
              currentRoute === 'ProfileScreen' 
                ? (isDarkMode ? '#000' : '#fff')
                : (isDarkMode ? '#fff' : '#000')
            } 
          />
        </Text>
      </TouchableOpacity>

     <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'CalendarScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('CalendarScreen')}
        style={[styles.navButton, currentRoute === 'CalendarScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('CalendarScreen')}
      >
        <Text>
          <MaterialIcons 
            name="calendar-today" 
            size={24} 
            color={
              currentRoute === 'CalendarScreen' 
                ? (isDarkMode ? '#000' : '#fff')
                : (isDarkMode ? '#fff' : '#000')
            } 
          />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'StatisticsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('StatisticsScreen')}
        style={[styles.navButton, currentRoute === 'StatisticsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('StatisticsScreen')}
      >
        <Text>
          <MaterialIcons 
            name="pie-chart" 
            size={24} 
            color={
              currentRoute === 'StatisticsScreen' 
                ? (isDarkMode ? '#000' : '#fff')
                : (isDarkMode ? '#fff' : '#000')
            } 
          />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'NotificationScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('NotificationScreen')}
        style={[styles.navButton, currentRoute === 'NotificationScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('NotificationScreen')}
      >
        <Text>
          <MaterialIcons 
            name="notifications" 
            size={24} 
            color={
              currentRoute === 'NotificationScreen' 
                ? (isDarkMode ? '#000' : '#fff')
                : (isDarkMode ? '#fff' : '#000')
            } 
          />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'SettingsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('SettingsScreen')}
        style={[styles.navButton, currentRoute === 'SettingsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('SettingsScreen')}
      >
        <Text>
          <MaterialIcons 
            name="settings" 
            size={24} 
            color={
              currentRoute === 'SettingsScreen' 
                ? (isDarkMode ? '#000' : '#fff')
                : (isDarkMode ? '#fff' : '#000')
            } 
          />
        </Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default BottomNavigation;
