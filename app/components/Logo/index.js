import React from "react";
import { Image, StyleSheet } from "react-native";
import styles from './styles';

export default function Logo() {
  return (
    <Image
      source={require("../../../assets/items/Chrystal.png")}
      style={styles.image}
    />
  );
}

