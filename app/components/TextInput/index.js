import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { theme } from "../../core/theme";
import styles from "./styles";

export default function TextInput({ errorText, description, right, ...props }) {
  return (
    <View style={styles.container}>
      <PaperTextInput
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        right={right ? <PaperTextInput.Icon icon={() => right} /> : null} // Render the icon properly
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}
