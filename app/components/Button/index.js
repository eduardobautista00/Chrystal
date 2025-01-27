import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";


import styles from './styles';
import { theme } from "../../core/theme";
export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === "outlined" && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  );
}
