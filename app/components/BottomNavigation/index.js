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
        style={[styles.navButton, currentRoute === 'ProfileScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text><MaterialIcons name="home" size={24} color={currentRoute === 'ProfileScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>

     <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'CalendarScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('CalendarScreen')}
      >
        <Text><MaterialIcons name="calendar-today" size={24} color={currentRoute === 'CalendarScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'StatisticsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('StatisticsScreen')}
      >
        <Text><MaterialIcons name="pie-chart" size={24} color={currentRoute === 'StatisticsScreen' ? "white" : "black"} /></Text> 
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'NotificationScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('NotificationScreen')}
      >
        <Text><MaterialIcons name="notifications" size={24} color={currentRoute === 'NotificationScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, currentRoute === 'SettingsScreen' && { backgroundColor: '#7B61FF' }]}
        onPress={() => navigation.navigate('SettingsScreen')}
      >
        <Text><MaterialIcons name="settings" size={24} color={currentRoute === 'SettingsScreen' ? "white" : "black"} /></Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default BottomNavigation;
