import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import getEnvVars from '../../config/env';
import CustomFilter from '../CustomFilter';
import styles from './styles';
import { useDarkMode } from '../../context/DarkModeContext';

export default function FeaturedListing({ onFilterChange, selectedFilter }) {
  const refRBSheet = useRef(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const MAX_HEIGHT = SCREEN_HEIGHT * 0.8; // Max expanded height (80%)
  const MIN_HEIGHT = SCREEN_HEIGHT * 0.35; // Minimum height (35%)
  const [selectedFilterId, setSelectedFilterId] = useState(null); // State to hold selected filter ID
  const { isDarkMode } = useDarkMode();
  console.log('Selected Filter in Parent:', selectedFilter);

  
  const handleFilterSelect = (filter) => {
    setSelectedFilterId(filter.id); // Update selected filter ID
    onFilterChange(filter); // Pass the selected filter to the parent (DashboardScreen)
  };

  // Define the handleFilterChange function
  const handleFilterChange = (filter) => {
    setSelectedFilterId(filter.id); // Update selected filter ID
    onFilterChange(filter); // Pass the selected filter to the parent (DashboardScreen)
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const { apiUrl } = getEnvVars();
      try {
        const response = await fetch(`${apiUrl}/properties`);
        const data = await response.json();
        console.log('API Response listings:', data);
        setListings(data.property);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setListings([]);
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
        return `$${formattedPrice}`;
    }
  };

  // Handle drag and restrict max height
  const handleOnDrag = (position) => {
    if (position < MIN_HEIGHT) {
      refRBSheet.current.setState({ height: MIN_HEIGHT });
    } else if (position > MAX_HEIGHT) {
      refRBSheet.current.setState({ height: MAX_HEIGHT });
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to open the RBSheet */}
      <TouchableOpacity 
        onPress={() => {
          refRBSheet.current.open(); // Open the RBSheet regardless of selectedFilterId
        }} 
        style={[styles.showButton, isDarkMode && { backgroundColor: '#1A1A1A', borderColor: '#fff', borderWidth: 1 }]}
      >
        <FontAwesome name="filter" size={25} color="#7B61FF" />
      </TouchableOpacity>

      <RBSheet
        ref={refRBSheet}
        height={MAX_HEIGHT} // Max expanded height
        minClosingHeight={MIN_HEIGHT} // Prevent going too low
        draggable
        closeOnDragDown={false} // Prevent full close on drag
        closeOnPressMask={false} // Disable closing by tapping outside
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: {
            backgroundColor: '#ccc',
            width: 50,
            height: 10,
            borderRadius: 5,
            alignSelf: 'center',
            marginTop: 10,
          },
        }}
        dragFromTopOnly={true} // Restrict dragging from top only
        onDrag={(e, gestureState) => handleOnDrag(gestureState.moveY)} // Handle drag to limit height
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.title}>Filters</Text>
        </View>

        {/* <View style={styles.carouselContainer}>
          {isLoading ? (
            // Show loading indicator while fetching data
            <ActivityIndicator size="large" color="#0000ff" />
          ) : listings.length === 0 ? (
            // Display message when no listings are available
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>No listings available</Text>
          ) : (
            // Render the FlatList of listings
            <FlatList
              data={listings}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast" // Allows smooth snapping
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Image
                    source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
                    style={styles.image}
                  />
                  <Text style={styles.price}>{formatPrice(item.price, item.currency)}</Text>
                  <Text style={styles.cardTitle}>{item.property_name}</Text>
                  <View style={styles.addressContainer}>
                    <MaterialIcons name="location-on" size={16} color="#7B61FF" />
                    <Text style={styles.address}>{item.address}</Text>
                  </View>
                </View>
              )}
            />
          )}
        </View> */}
        <CustomFilter 
          onFilterChange={handleFilterChange} 
          onFilterSelect={handleFilterSelect}
          refRBSheet={refRBSheet} 
          style={styles.CustomFilter} 
          selectedFilterId={selectedFilterId} 
          selectedFilter={selectedFilter}
        />
      </RBSheet>
    </View>
  );
}