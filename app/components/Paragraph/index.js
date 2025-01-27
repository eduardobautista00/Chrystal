import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import styles from './styles';

export default function Paragraph(props) {
  return <Text style={styles.text} {...props} />;
}

