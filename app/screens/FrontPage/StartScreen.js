import React, { useEffect, useRef, useCallback } from "react";
import { Animated, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { theme } from "../../core/theme";

import Background from "../../components/Background";
import Logo from "../../components/Logo";
import FrontpageLayout from '../../layout/Frontpage';

export default function StartScreen({ navigation }) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulsingAnimationRef = useRef(null); // Store the pulsing animation reference

  // Fade-in animation
  const startAnimations = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Start pulsing animation
    pulsingAnimationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulsingAnimationRef.current.start();
  };

  const stopAnimations = () => {
    // Stop the pulsing animation loop
    if (pulsingAnimationRef.current) {
      pulsingAnimationRef.current.stop();
      pulsingAnimationRef.current = null; // Clear the ref
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Reset and start animations on focus
      opacityAnim.setValue(0);
      scaleAnim.setValue(1);
      startAnimations();

      // Navigate to LoginScreen after delay
      const timer = setTimeout(() => {
        navigation.navigate('LoginScreen', { someParam: 'high 5' });
      }, 3000);

      return () => {
        stopAnimations(); // Stop animations on screen blur/unfocus
        clearTimeout(timer); // Clear timeout if navigating away
      };
    }, [navigation])
  );

  const checkToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('accessToken');
      if (storedToken) {
        console.log('Token exists:', storedToken);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.error('Check token error:', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <FrontpageLayout>
      <Background>
        <View style={styles.center}>
          <Animated.View style={[styles.logoContainer, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
            <Logo />
          </Animated.View>
        </View>
      </Background>
    </FrontpageLayout>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
