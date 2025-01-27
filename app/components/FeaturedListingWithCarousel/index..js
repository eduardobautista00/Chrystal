import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Slick from 'react-native-slick';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import getEnvVars from '../../config/env';

const { width, height } = Dimensions.get('window');

export default function FeaturedListingWithCarousel() {
  const translateY = useSharedValue(height * 0.75);
  const [isSlidingHorizontally, setIsSlidingHorizontally] = useState(false);
  const [gestureDirection, setGestureDirection] = useState('vertical');
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { apiUrl } = getEnvVars();
      try {
        const response = await fetch(`${apiUrl}/properties`);
        const data = await response.json();
        setListings(data.property || []); // Ensure array fallback
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setListings([]); // Clear listings on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (price, currency) => {
    const formattedPrice = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(price);
    switch (currency) {
      case 'USD':
        return `$${formattedPrice}`;
      case 'YEN':
        return `¥${formattedPrice}`;
      case 'EUR':
        return `€${formattedPrice}`;
      default:
        return `$${formattedPrice}`; // Default to USD if currency is not specified
    }
  };

  const verticalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const onVerticalGestureEvent = useCallback(
    ({ nativeEvent }) => {
      if (gestureDirection === 'vertical' && !isSlidingHorizontally) {
        const newTranslateY = translateY.value + nativeEvent.translationY;
        translateY.value = Math.max(Math.min(newTranslateY, height * 0.75), height * 0.25);
      }
    },
    [gestureDirection, isSlidingHorizontally]
  );

  const handleGestureStateChange = ({ nativeEvent }) => {
    const { velocityX, velocityY, state } = nativeEvent;

    if (state === State.BEGAN) {
      const isHorizontal = Math.abs(velocityX) > Math.abs(velocityY);
      setGestureDirection(isHorizontal ? 'horizontal' : 'vertical');
      setIsSlidingHorizontally(isHorizontal);
    } else if (state === State.END) {
      if (gestureDirection === 'vertical') {
        translateY.value = withSpring(
          translateY.value < height * 0.5 ? height * 0.25 : height * 0.75,
          { duration: 200 }
        );
      }
    }
  };

  const handleHorizontalGesture = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      setIsSlidingHorizontally(true);
    } else if (nativeEvent.state === State.END) {
      setIsSlidingHorizontally(false);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={gestureDirection === 'vertical' ? onVerticalGestureEvent : null}
      onHandlerStateChange={handleGestureStateChange}
    >
      <Animated.View style={[styles.container, verticalAnimatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Featured Listing</Text>
        </View>
        <PanGestureHandler onHandlerStateChange={handleHorizontalGesture}>
          <Slick
            showsPagination={false}
            autoplay={true}
            autoplayTimeout={3}
            loop={true}
            contentContainerStyle={styles.slickContent}
            dotColor="#7B61FF"
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : listings.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No listings available</Text>
            ) : (
              listings.map((item) => (
                <View key={item.id} style={styles.cardContainer}>
                  <Image
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                    style={styles.image}
                  />
                  <Text style={styles.price}>{formatPrice(item.price, item.currency)}</Text>
                  <Text style={styles.cardTitle}>{item.property_name}</Text>
                  <View style={styles.addressContainer}>
                    <Text>
                      <MaterialIcons name="location-on" size={16} color="#7B61FF" />
                    </Text>
                    <Text style={styles.address}>{item.address}</Text>
                  </View>
                </View>
              ))
            )}
          </Slick>
        </PanGestureHandler>
        <CustomFilter />
      </Animated.View>
    </PanGestureHandler>
  );
}
