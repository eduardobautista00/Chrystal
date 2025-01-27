import React from "react";
import { View, Image } from "react-native";
import styles from "./styles"; // Ensure the path is correct

export default function SuccessImage({ source }) {
  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} />
    </View>
  );
}

