import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import getEnvVars from '../../config/env';
import { useAuth } from '../../context/AuthContext'; // Assuming useAuth is available for auth state

const PropertyList = ({ navigation }) => {
  const [properties, setProperties] = useState([]); // State to store fetched properties
  const [loading, setLoading] = useState(true); // State to handle loading state
  const { apiUrl } = getEnvVars();
  const { authState } = useAuth();

  // Function to convert currency code to symbol
  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode.toUpperCase()) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'JPY':
        return '¥';
      default:
        return currencyCode; // Fallback to the code if no symbol is defined
    }
  };

  useEffect(() => {
    let intervalId; // Store interval ID for cleanup
  
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${apiUrl}/properties`);
        const data = await response.json();
  
        if (Array.isArray(data.property)) {
          const userProperties = data.property.filter(
            (property) => property.user_id === authState.user.id && property.status === 'available'
          );
          setProperties(userProperties);
        } else if (data.property && data.property.user_id === authState.user.id) {
          setProperties([data.property]);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (authState.user && authState.user.id) {
      fetchProperties(); // Initial fetch
      intervalId = setInterval(fetchProperties, 5000); // Poll every 5 seconds
    }
  
    return () => {
      clearInterval(intervalId); // Clean up interval on unmount
    };
  }, [apiUrl, authState.user]);

  // Render property item
  const renderItem = ({ item }) => {
    const formattedPrice = parseFloat(item.price).toFixed(2).endsWith('.00')
      ? parseInt(item.price, 10) // Remove ".00" if present
      : parseFloat(item.price).toFixed(2); // Otherwise, keep the formatted value

    return (
      <TouchableOpacity
        style={styles.propertyItem}
        onPress={() => navigation.navigate('PropertyDetails', { property: item })} // Pass property details to the next screen
      >
        <Image 
          source={{ uri: item.image_url ? item.image_url : 'https://dummyimage.com/100x100' }} 
          style={styles.propertyImage} 
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyPrice}>
            {getCurrencySymbol(item.currency)} {formattedPrice}
          </Text>
          <Text style={styles.propertyTitle}>{item.property_name}</Text>
          <View style={styles.addressContainer}>
            <Icon name="location-outline" size={16} color="#7B61FF" style={styles.addressIcon} />
            <Text style={styles.propertyAddress} numberOfLines={2}>
              {item.address && item.address.length > 30 ? `${item.address.substring(0, 28)}...` : item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.propertyListContainer}>
      <View style={styles.propertyListHeader}>
        <Text style={styles.propertyListHeadertext}>My Property List</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPropertiesScreen')}>
          <Text style={styles.addButtonText}>+ Add Property</Text>
        </TouchableOpacity>
      </View>

      {/* Show loader while fetching data */}
      {loading ? (
        <ActivityIndicator size="large" color="#7B61FF" style={{ marginTop: 20 }} />
      ) : properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Ensure key is a string
          contentContainerStyle={{ paddingBottom: 20 }} // Add space at the bottom
          showsVerticalScrollIndicator={false} // Hide scroll indicator for a cleaner look
        />
      ) : (
        <View style={styles.noPropertiesContainer}>
          <Text style={styles.noPropertiesText}>No properties listed yet</Text>
        </View>
      )}
    </View>
  );
};

export default PropertyList;
