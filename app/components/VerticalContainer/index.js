import React, { useState, useCallback } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ListingCarousel from '../HorizontalListings';
import CustomFilter from '../../components/CustomFilter';

import styles from './styles';

const { height, width } = Dimensions.get('window');

export default function FeaturedListing() {
  const translateY = useSharedValue(height * 0.75);
  const [isSlidingHorizontally, setIsSlidingHorizontally] = useState(false);
  const [gestureDirection, setGestureDirection] = useState('vertical'); // Track the current gesture type

  const verticalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Handle vertical gesture
  const onVerticalGestureEvent = useCallback(({ nativeEvent }) => {
    if (gestureDirection === 'vertical' && !isSlidingHorizontally) {
      const newTranslateY = translateY.value + nativeEvent.translationY;
      translateY.value = withSpring(Math.max(Math.min(newTranslateY, height * 0.75), height * 0.25));
    }
  }, [gestureDirection, isSlidingHorizontally]);

  // Reset position after gesture ends
  const onVerticalGestureEnd = () => {
    translateY.value = withSpring(
      translateY.value < height * 0.5 ? height * 0.25 : height * 0.75,
      { duration: 200 }
    );
  };

  // Detect the direction of swipe to toggle gestures
  const handleGestureStateChange = (event) => {
    const { translationX, translationY, state } = event.nativeEvent;

    if (state === State.BEGAN) {
      // Detect horizontal vs vertical swipe
      if (Math.abs(translationX) > Math.abs(translationY)) {
        setGestureDirection('horizontal');
        setIsSlidingHorizontally(true); // Allow horizontal swipe
      } else {
        setGestureDirection('vertical');
        setIsSlidingHorizontally(false); // Lock horizontal swipe
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onVerticalGestureEvent}
      onEnded={onVerticalGestureEnd}
      onHandlerStateChange={handleGestureStateChange} // Determine the direction
      style={styles.vertical}
    >
      <Animated.View style={[styles.container, verticalAnimatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Featured Listing</Text>
          {/* <Text style={styles.viewMore}>View more</Text> */}
        </View>
        <ListingCarousel />
        <CustomFilter />
      </Animated.View>
    </PanGestureHandler>
  );
}
