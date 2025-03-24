import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the FontAwesome icon
import styles from './styles'; // Ensure the path to styles is correct
import { useDarkMode } from '../../context/DarkModeContext';

export default function BackButton({ navigation }) {
  const { isDarkMode } = useDarkMode();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('DashboardScreen')} style={styles.container}>
      <Icon name="chevron-left" size={20} color={isDarkMode ? '#FFFFFF' : '#000000'} />
    </TouchableOpacity>
  );
}
