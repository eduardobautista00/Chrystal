import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the FontAwesome icon
import styles from './styles'; // Ensure the path to styles is correct

export default function BackButton({ goBack }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Icon name="chevron-left" size={20} color="#000" />
    </TouchableOpacity>
  );
}
