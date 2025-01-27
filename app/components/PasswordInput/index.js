import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TextInput from "../TextInput"; // Your custom TextInput component
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles"; // Ensure this path is correct

export default function PasswordInput({
  label,
  value,
  onChangeText,
  errorText,
  passwordVisible,
  setPasswordVisible,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!passwordVisible}
        errorText={errorText}
        mode="outlined"
        right={
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
              style={{ marginRight: 8 }} // Adjust spacing
            />
          </TouchableOpacity>
        }
      />
    </View>
  );
}
