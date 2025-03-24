import React, { useState, useCallback } from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import styles from './styles';
import { useDarkMode } from "../../context/DarkModeContext";

export default function Background({ children }) {
  const { isDarkMode } = useDarkMode();
  const translateX = useState(new Animated.Value(400))[0]; // Start off-screen to the right

  useFocusEffect(
    useCallback(() => {
      // Reset translateX to the initial value
      translateX.setValue(400);
      
      // Start the animation whenever the screen is focused
      Animated.spring(translateX, {
        toValue: 0, // End position (fully on screen)
        tension: 10, // Increase to slow down the spring
        friction: 8, // Increase to slow down the spring
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, [translateX])
  );

  return (
    <ImageBackground
      source={require("../../../assets/items/dot.png")}
      resizeMode="no-repeat"
      style={[styles.background, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }]}
    >
      <KeyboardAvoidingView style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }]} behavior="padding">
        <Animated.View style={{ transform: [{ translateX }], backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }}>
          <ScrollView
            contentContainerStyle={[styles.scrollViewContent, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }]}
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}