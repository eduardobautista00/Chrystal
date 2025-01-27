import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons for simple icons
import styles from './styles';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const [currentRoute, setCurrentRoute] = useState(navigation.getState().routes[navigation.getState().index].name);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setCurrentRoute(navigation.getState().routes[navigation.getState().index].name);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'AuthPage_ProfileScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('AuthPage_ProfileScreen')}
      >
        <Text><MaterialIcons name="home" size={24} color={currentRoute === 'AuthPage_ProfileScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>

     <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'AuthPage_CalendarScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('AuthPage_CalendarScreen')}
      >
        <Text><MaterialIcons name="calendar-today" size={24} color={currentRoute === 'AuthPage_CalendarScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'AuthPage_StatisticsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('AuthPage_StatisticsScreen')}
      >
        <Text><MaterialIcons name="pie-chart" size={24} color={currentRoute === 'AuthPage_StatisticsScreen' ? "white" : "black"} /></Text> 
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'AuthPage_NotificationScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('AuthPage_NotificationScreen')}
      >
        <Text><MaterialIcons name="notifications" size={24} color={currentRoute === 'AuthPage_NotificationScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'AuthPage_SettingsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('AuthPage_SettingsScreen')}
      >
        <Text><MaterialIcons name="settings" size={24} color={currentRoute === 'AuthPage_SettingsScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default BottomNavigation;
