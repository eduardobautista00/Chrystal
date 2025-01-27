import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";


import styles from './styles';

export default function Header(props) {
  return <Text style={styles.header} {...props} />;
}
