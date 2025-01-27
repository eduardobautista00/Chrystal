import React from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView, // Import ScrollView
} from "react-native";

import styles from './styles';

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require("../../../assets/items/dot.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          keyboardShouldPersistTaps="handled" // Ensures taps are handled when keyboard is open
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}