import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"; // Changed from FontAwesome to FontAwesome5
import styles from './styles'; // Ensure the path to styles is correct
import { useDarkMode } from '../../context/DarkModeContext';

export default function BackButton({ goBack }) {
  const { isDarkMode } = useDarkMode();
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Icon name="chevron-left" size={20} color={isDarkMode ? '#ffffff' : '#000000'} solid />
    </TouchableOpacity>
  );
}
