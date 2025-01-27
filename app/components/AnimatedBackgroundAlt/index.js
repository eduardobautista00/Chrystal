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

export default function Background({ children }) {
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
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Animated.View style={{ transform: [{ translateX }] }}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
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