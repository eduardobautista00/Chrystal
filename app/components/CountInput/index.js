import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./styles";

export default function CountInput({ label, value, onValueChange }) {
  const increment = () => onValueChange(value + 1);
  const decrement = () => onValueChange(value > 0 ? value - 1 : 0);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counter}>
        <Text style={styles.value}>{value}</Text>
        <View>
      <TouchableOpacity onPress={increment} style={styles.button}>
        <Text><Icon name="chevron-up" size={20} color="#868686" /></Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={decrement}  style={styles.button}>
        <Text><Icon name="chevron-down" size={20} color="#868686" /></Text>
      </TouchableOpacity>
    </View>
        
      </View>
    </View>
  );
}
