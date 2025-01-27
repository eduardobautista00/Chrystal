import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator } from 'react-native';
import Slick from 'react-native-slick';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import getEnvVars from '../../config/env';

const { width } = Dimensions.get('window');

export default function ListingCarousel() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { apiUrl } = getEnvVars();
      try {
        const response = await fetch(`${apiUrl}/properties`);
        const data = await response.json();
        console.log('API Response listings:', data); // Debug API response
        console.log('Listings fetched:', data.property); // Ensure data.property is an array
        console.log('length', data.property.length);
        setListings(data.property); // Ensure array fallback
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
    switch(currency) {
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

  return (
    <View style={styles.carouselContainer}>
      <Slick
  showsPagination={false}
  autoplay={true} // Enable autoplay
  autoplayTimeout={3} // Set autoplay interval to 3 seconds
  loop={true} // Loop the carousel
  scrollEnabled={true}
  contentContainerStyle={styles.slickContent}
  dotColor="#7B61FF" // Add custom dot color (optional)
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

    </View>
  );
}
