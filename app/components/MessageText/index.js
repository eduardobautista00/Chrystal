import React from "react";
import { View, Text } from "react-native";
import styles from "./styles"; // Ensure this path is correct

export default function MessageText({ text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
}
