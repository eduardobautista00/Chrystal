import React, { useEffect, useState, useRef } from 'react';
import { View, Alert, ActivityIndicator, Platform, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../config/env';
import MapSearchField from '../MapSearchField'; 
import styles from './styles';
import * as Location from 'expo-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Icon from 'react-native-vector-icons/Foundation';

export default function MapComponent() {
  const mapRef = useRef(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [isMarkersFetched, setIsMarkersFetched] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const { apiUrl } = getEnvVars();

  const handleSearchChange = (text) => {
    console.log('[MapComponent] Search value changed:', text);
    setSearchValue(text);
  };

  const centerMapOnUser = () => {
    console.log('[MapComponent] Centering map on user location');
    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  const handleClear = async () => {
    console.log('[MapComponent] Clearing search and filters');
    setSearchValue('');
    setSelectedFilters([]);
    setFilteredMarkers(markers);

    if (mapRef.current && currentRegion) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  const handleSearchSubmit = () => {
    console.log('[MapComponent] Submitting search with value:', searchValue);

    // Clean the search value: remove leading/trailing spaces and replace multiple spaces with a single space
    const cleanedSearchValue = searchValue.trim().replace(/\s+/g, ' ').toLowerCase();

    const filtered = markers.filter(marker => {
        // Clean the marker description and title: remove extra spaces
        const markerDescriptionCleaned = marker.description.trim().replace(/\s+/g, ' ').toLowerCase();
        const markerTitleCleaned = marker.title.trim().replace(/\s+/g, ' ').toLowerCase();

        // Make both search and marker descriptions non-strict and case-insensitive
        const isMatch = selectedFilters.every(filter =>
            markerDescriptionCleaned.includes(filter.trim().replace(/\s+/g, ' ').toLowerCase())
        );

        // Ensure the title and search value are compared in a case-insensitive, non-strict way
        return markerTitleCleaned.includes(cleanedSearchValue) && isMatch;
    });

    setFilteredMarkers(filtered);
    console.log('[MapComponent] Filtered markers:', filtered);

    if (filtered.length > 0) {
        const firstMarker = filtered[0];
        zoomToMarker(firstMarker);
    } else {
        Alert.alert('No results found', 'No markers matched your search.');
    }
};




  const handleFilterToggle = (filter) => {
    console.log('[MapComponent] Toggling filter:', filter);
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const defaultRegion = {
    latitude: 37.7749, // Example: San Francisco latitude
    longitude: -122.4194, // Example: San Francisco longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const fetchUserLocation = async () => {
    try {
      console.log('[MapComponent] Requesting user location...');
      
      // Request for location permission using expo-location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      console.log('[MapComponent] Location permission granted.');

      // Fetch location using expo-location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 20000,
      });

      console.log('[MapComponent] Fetched location:', location);

      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setCurrentRegion(userRegion);
      console.log('[MapComponent] Updated region to user location:', userRegion);
    } catch (error) {
      console.error('[MapComponent] Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch location. Using default location.');
      setCurrentRegion(defaultRegion); // Fallback to default region
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Start with a default region
    setCurrentRegion(defaultRegion);
    console.log('[MapComponent] Set default region:', defaultRegion);

    // Fetch and update user location
    fetchUserLocation();
  }, []);
  
  

  const fetchMarkers = async () => {
    try {
      console.log('[MapComponent] Fetching markers from API...');
      const response = await fetch(`${apiUrl}/properties`);
      const data = await response.json();

      if (response.ok && data?.property) {
        const extractedMarkers = data.property.map((property) => ({
          coordinate: {
            latitude: parseFloat(property.latitude),
            longitude: parseFloat(property.longitude),
          },
          title: property.property_name || 'Unknown',
          description: property.address || 'No Address',
        }));

        console.log('[MapComponent] Markers fetched:', extractedMarkers);
        setMarkers(extractedMarkers);
        setFilteredMarkers(extractedMarkers);
        setIsMarkersFetched(true);
      } else {
        console.error('[MapComponent] Error: Failed to fetch markers');
        Alert.alert('Error', 'Failed to fetch markers');
      }
    } catch (error) {
      console.error('[MapComponent] Error fetching markers:', error);
      Alert.alert('Error', 'Failed to fetch markers');
    }
  };

  useEffect(() => {
    fetchUserLocation();
    fetchMarkers();
  }, []);

  useEffect(() => {
    if (currentRegion && mapRef.current) {
      console.log('[MapComponent] Animating map to current region:', currentRegion);
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  }, [currentRegion]);

  useEffect(() => {
    if (selectedFilters.length > 0) {
      console.log('[MapComponent] Applying filters:', selectedFilters);
      const filtered = markers.filter(marker =>
        selectedFilters.every(filter =>
          marker.description.toLowerCase().includes(filter.toLowerCase())
        )
      );
      setFilteredMarkers(filtered);
    } else {
      setFilteredMarkers(markers);
    }
  }, [selectedFilters, markers]);

  const zoomToMarker = (marker) => {
    console.log('[MapComponent] Zooming to marker:', marker);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...marker.coordinate,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  };

  const handleMarkerPress = (marker) => {
    console.log('[MapComponent] Marker pressed:', marker);
    zoomToMarker(marker);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <MapSearchField
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onClear={handleClear}
            onFilterToggle={handleFilterToggle}
          />
           <MapView
            style={styles.map}
            ref={mapRef}
            region={currentRegion}
            showsUserLocation
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
          >
            {filteredMarkers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                onPress={() => handleMarkerPress(marker)}
              />
            ))}
          </MapView>
          <TouchableOpacity style={styles.customButton} onPress={centerMapOnUser}>
            <Text><Icon name="target-two" size={25} color="#7B61FF" /></Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
