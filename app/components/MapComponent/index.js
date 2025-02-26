import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Platform, TouchableOpacity, 
Text, Button, Modal, TouchableWithoutFeedback, ScrollView, Image, Switch } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../config/env';
import MapSearchField from '../MapSearchField'; 
import styles from './styles';
import * as Location from 'expo-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Icon from 'react-native-vector-icons/Foundation';
import { useAuth } from "../../context/AuthContext";
import TextInput from '../../components/TextInput';
import PhoneInput from '../../components/PhoneInput';
import AddPropertyCustomInputs from '../../components/AddPropertyCustomInputs';
import CountInput from '../../components/CountInput';
import * as ImagePicker from 'expo-image-picker';
import { useData } from "../../context/DataContext";
import axios from 'axios';

export default function MapComponent({ selectedFilter }) {
  const mapRef = useRef(null);
  const { property } = useData();
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [customFilteredMarkers, setCustomFilteredMarkers] = useState([]);
  const [isMarkersFetched, setIsMarkersFetched] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tapMarker, setTapMarker] = useState(null); // State to store tapped marker location
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [modalLocation, setModalLocation] = useState(null); // Store location data for modal
  const { authState } = useAuth();
  const [pinColor, setPinColor] = useState('#FF0000'); // Default marker color
  const propertyTypeOptions = ['House', 'Townhouse', 'Unit', 'Land'];

  const { apiUrl } = getEnvVars();
  const { googleMapsApiKey } = getEnvVars();

  const [formData, setFormData] = useState({
    property_name: "",
    seller: {
        seller_first_name: "",
        seller_last_name: "",
        seller_email: "",
        seller_phone_number: "",
    },
    seller_already_exists: false,
    seller_id: null,
    price: "",
    area: "",
    currency: "USD",
    unit: "km2",
    bedrooms: 1,
    bathrooms: 1,
    kitchen: 1,
    garage: 1,
    image: "",
    pin_color: "",
    property_type: "",
  });

  const [phone, setPhone] = useState(formData.seller.seller_phone_number || "");
  const [addressChangeTimeoutId, setAddressChangeTimeoutId] = useState(null); // State to store the timeout ID
  const [errors, setErrors] = useState({});

  // Log the selected filter whenever it changes
  useEffect(() => {
    console.log('Selected Filter in MapComponent:', selectedFilter);
  }, [selectedFilter]);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const onAddPressed = async () => {
    // New code to check if all fields are filled
    const { property_name, seller, price, area, image } = formData;

    // Check if seller already exists
    if (formData.seller_already_exists) {
        // Only check for seller_email and other required fields
        if (!seller.seller_email || !property_name || !price || !area) {
            Alert.alert("Incomplete Form", "Please fill in all required fields before submitting.");
            return;
        }
    } else {
        // Check all fields if seller does not already exist
        if (!property_name || !seller.seller_first_name || !seller.seller_last_name || !seller.seller_email || !price || !area) {
            Alert.alert("Incomplete Form", "Please fill in all fields before submitting.");
            return;
        }
    }

    try {
      const formDataToSubmit = new FormData();

      // Append the image file only if it is provided
      if (formData.image) { // Only append the image if it is provided
        formDataToSubmit.append('image_url', {
          uri: formData.image, // The URI of the image from formData
          type: formData.image.type || 'image/jpeg', // The MIME type of the image
          name: formData.image.name || 'property_image', // Default name for the image
        });
      }

      // Flatten seller information and append it as top-level fields
      const { seller, ...restData } = formData;
      Object.keys(restData).forEach((key) => {
        formDataToSubmit.append(key, restData[key]);
      });

      // New code to conditionally append seller information
      if (!formData.seller_already_exists) {
        Object.keys(seller).forEach((key) => {
          formDataToSubmit.append(key, seller[key]);
        });
      }

      // New code to append user_id, latitude, longitude, and address
      const userId = authState.user.id; // Get user ID from authState
      const latitude = modalLocation.latitude; // Get latitude from modalLocation
      const longitude = modalLocation.longitude; // Get longitude from modalLocation
      //const pinColor = formData.pin_color; // Ensure pinColor is correctly set from formData
      const propertyType = formData.property_type;

      // Fetch the exact address using Google Geocoding API
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;
      
      const geocodeResponse = await axios.get(geocodeUrl);
      const address = geocodeResponse.data.results[0]?.formatted_address || 'Address not found'; // Get the formatted address

      formDataToSubmit.append('user_id', userId);
      formDataToSubmit.append('latitude', latitude);
      formDataToSubmit.append('longitude', longitude);
      formDataToSubmit.append('address', address);

      // New code to append marker color
      formDataToSubmit.append('pin_color', pinColor); // Append the selected marker color

      // New code to append property type
      formDataToSubmit.append('property_type', propertyType); // Append the selected property type

      // New code to sanitize price and area
      const sanitizedPrice = formData.price.replace(/[^0-9.]/g, ''); // Remove non-numerical characters from price
      const sanitizedArea = formData.area.replace(/[^0-9.]/g, ''); // Remove non-numerical characters from area

      // Append sanitized values to formDataToSubmit
      formDataToSubmit.append('price', sanitizedPrice);
      formDataToSubmit.append('area', sanitizedArea);

      // Debugging: Log the transformed FormData
      //console.log("FormData being sent to the API:");
      for (const [key, value] of formDataToSubmit.entries()) {
        //console.log(`${key}:`, value);
      }

      console.log("FormData being sent to the API:", formDataToSubmit);
      const response = await property.addProperty(formDataToSubmit);
      //console.log("Response from addProperty:", response);

      // Updated code to check for success message in the response data
      if (response) {
        Alert.alert("Success", "Your property details have been submitted. Wait for approval.");
        closeModal(); // Close the modal after submission

        // New code to clear form data and fetch markers again
        setFormData({
          property_name: "",
          seller: {
              seller_first_name: "",
              seller_last_name: "",
              seller_email: "",
              seller_phone_number: "",
          },
          seller_already_exists: false,
          price: "",
          area: "",
          currency: "USD",
          unit: "km2",
          bedrooms: 1,
          bathrooms: 1,
          kitchen: 1,
          garage: 1,
          image: "",
          pin_color: "",
          property_type: "",
        });
        fetchMarkers(); // Fetch markers again after submission
      } else {
        Alert.alert("Error", "Failed to add property. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the form.");
      console.error("Submission error:", error);
    }
  };

  const handleSwitchChange = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      seller_already_exists: !prevFormData.seller_already_exists,
    }));
    
    // Log the state of the switch
    //console.log("Seller already exists:", !formData.seller_already_exists);

    if (!formData.seller_already_exists) {
      // Reset seller info if switching to new seller
      setFormData((prevFormData) => ({
        ...prevFormData,
        seller: {
          seller_first_name: "",
          seller_last_name: "",
          seller_phone_number: "",
          seller_address: "",
          seller_email: prevFormData.seller.seller_email, // Keep email
        },
      }));
    }
  };

  const handleSellerEmailChange = async (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      seller: {
        ...prevFormData.seller,
        seller_email: value,
      },
    }));

    // Clear the previous timeout if it exists
    if (addressChangeTimeoutId) {
      clearTimeout(addressChangeTimeoutId);
    }

    // Set a new timeout to check seller details after a delay
    const timeoutId = setTimeout(async () => {
      // If sellerAlreadyExists is true, fetch seller details by email
      if (formData.seller_already_exists) {
        try {
          const response = await axios.get(`${apiUrl}/get-seller-by-email`, {
            params: {
              email: value, // Use the updated email value
            },
          });

          // Check if the response indicates that the seller exists
          if (response.data && response.data.exists) {
            const sellerData = response.data; // Assuming seller data is in the response
            //console.log("Fetched Seller Data:", sellerData);
            // Update formData with fetched seller details
            setFormData((prevFormData) => ({
              ...prevFormData,
              seller_id: sellerData.seller_id, // Pass seller_id
              seller_already_exists: true, // Set to true since the seller exists
            }));
          } else {
            // Handle case where seller does not exist
            Alert.alert("Error", "Seller does not exist.");
          // Optionally reset seller fields or take other actions
          setFormData((prevFormData) => ({
            ...prevFormData,
            seller_id: null, // Reset seller_id
            seller_already_exists: false, // Reset to indicate new seller
            seller: {
              seller_first_name: "",
              seller_last_name: "",
              seller_phone_number: "",
              seller_address: "",
              seller_email: value, // Keep the email
            },
          }));
        }
        } catch (error) {
          console.error("Error fetching seller details:", error);
          Alert.alert("Error", "Unable to fetch seller details. Please check the email.");
        }
      }
    }, 3000); // 3 seconds delay

    setAddressChangeTimeoutId(timeoutId); // Store the new timeout ID
  };

  const handleSearchChange = (text) => {
    //console.log('[MapComponent] Search value changed:', text);
    setSearchValue(text);
  };

  const centerMapOnUser = () => {
  
    //console.log('[MapComponent] Centering map on user location');
    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  const handleClear = async () => {
    //console.log('[MapComponent] Clearing search and filters');
    setSearchValue('');
    setSelectedFilters([]);
    setFilteredMarkers(markers);

    if (mapRef.current && currentRegion) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  const handleSearchSubmit = () => {
    //console.log('[MapComponent] Submitting search with value:', searchValue);

    const cleanedSearchValue = searchValue.trim().replace(/\s+/g, ' ').toLowerCase();

    const searchedMarkers = markers.filter(marker => {
      const markerDescriptionCleaned = marker.description.trim().replace(/\s+/g, ' ').toLowerCase();
      const markerTitleCleaned = marker.title.trim().replace(/\s+/g, ' ').toLowerCase();
      
      // Use markerColor in your filtering logic if needed
      const isMatch = selectedFilters.every(filter =>
        markerDescriptionCleaned.includes(filter.trim().replace(/\s+/g, ' ').toLowerCase())
      );

      // Ensure the pin_color is included in the returned marker
      return markerTitleCleaned.includes(cleanedSearchValue) && isMatch;
    }).map(marker => ({
      ...marker,
      pin_color: marker.pin_color || pinColor, // Ensure pin_color is set
    }));

    setFilteredMarkers(searchedMarkers);
    console.log('[MapComponent] Searched markers:', searchedMarkers);

    if (searchedMarkers.length > 0) {
      const firstMarker = searchedMarkers[0];
      zoomToMarker(firstMarker);
      console.log('[MapComponent] searched marker:', firstMarker);
    } else {
      Alert.alert('No results found', 'No markers matched your search.');
    }
  };

  const handleFilterToggle = (filter) => {
    //console.log('[MapComponent] Toggling filter:', filter);
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
      //console.log('[MapComponent] Requesting user location...');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      //console.log('[MapComponent] Location permission granted.');

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 20000,
      });

      //console.log('[MapComponent] Fetched location:', location);

      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setCurrentRegion(userRegion);
      //console.log('[MapComponent] Updated region to user location:', userRegion);
    } catch (error) {
      //console.error('[MapComponent] Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch location. Using default location.');
      setCurrentRegion(defaultRegion); // Fallback to default region
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentRegion(defaultRegion);
    //console.log('[MapComponent] Set default region:', defaultRegion);
    fetchUserLocation();
  }, []);

  const filterMarkersBySelectedFilters = (extractedMarkers) => {
    if (selectedFilter && Object.keys(selectedFilter).length > 0) {
      const { areaRange, priceRange, property_type, color, currency, unit } = selectedFilter;

      console.log('Selected Filter Color:', color);
      console.log('Original Markers:', JSON.stringify(extractedMarkers, null, 2));

      const formatUnit = (unit) => {
        return unit.replace(/2/g, '²');
      };

      // Step 1: Filter by color
      let filteredByColor = extractedMarkers.filter(marker => {
        // Use pin_color for comparison
        return marker.pin_color === color;
      });

      console.log('After Color Filter:', JSON.stringify(filteredByColor, null, 2));

      if (filteredByColor.length === 0) {
        console.log('No markers matched the color filter.');
        setFilteredMarkers([]);
        return;
      }

      // Step 2: Filter by property type
      let filteredByPropertyType = filteredByColor.filter(marker => 
        property_type.includes(marker.property_type)
      );

      if (filteredByPropertyType.length === 0) {
        setFilteredMarkers([]);
        return;
      }

      // Step 3: Filter by currency and unit
      let filteredByCurrencyAndUnit = filteredByPropertyType.filter(marker => 
        marker.currency === currency && formatUnit(marker.unit) === unit
      );

      if (filteredByCurrencyAndUnit.length === 0) {
        setFilteredMarkers([]);
        return;
      }

      // Step 4: Filter by price and area
      let finalFiltered = filteredByCurrencyAndUnit.filter(marker => {
        const markerArea = parseFloat(marker.area);
        const markerPrice = parseFloat(marker.price);
        return (
          markerArea >= areaRange[0] && 
          markerArea <= areaRange[1] && 
          markerPrice >= priceRange[0] && 
          markerPrice <= priceRange[1]
        );
      });

      console.log('Final Filtered Markers:', JSON.stringify(finalFiltered, null, 2));

      if (finalFiltered.length > 0) {
        setFilteredMarkers(finalFiltered);
        zoomToMarker(finalFiltered[0]);
      } else {
        setFilteredMarkers([]);
      }
    } else {
      setFilteredMarkers(extractedMarkers);
    }
  };

  const fetchMarkers = async () => {
    try {
      //console.log('[MapComponent] Fetching markers from API...');

      if (!authState?.user?.id) {
        console.error('[MapComponent] Error: User not logged in');
        return;
      }

      const response = await fetch(`${apiUrl}/properties`);
      const data = await response.json();
      //console.log("Response from fetchMarkers:", data);

        // Check if response is ok and data is defined
        if (response.ok && data && data.property) {
            const userProperties = data.property.filter(
                (property) => property.user_id === authState.user.id && property.status === 'available'
            );
            //console.log("User Properties:", userProperties);

            const extractedMarkers = userProperties.map((property) => ({
                coordinate: {
                    latitude: parseFloat(property.latitude),
                    longitude: parseFloat(property.longitude),
                },
                title: property.property_name || 'Unknown',
                description: property.address || 'No Address',
                pin_color: property.pin_color || pinColor,
                area: property.area,
                price: property.price,
                currency: property.currency,
                unit: property.unit,
                property_type: property.property_type,
            }));

            console.log('Extracted Markers:', extractedMarkers);

            setMarkers(extractedMarkers);
            filterMarkersBySelectedFilters(extractedMarkers); // Apply filters after fetching markers
            setIsMarkersFetched(true);
        } else {
            console.error('[MapComponent] Error: Invalid response structure', data);
        }
    } catch (error) {
      console.error('[MapComponent] Error fetching markers:', error); // Improved logging
      // No alert here, just log the error
    }
  };

  useEffect(() => {
    //fetchUserLocation();
    zoomOut();
    fetchMarkers();
    filterMarkersBySelectedFilters(markers);

    // Only set up the interval if searchValue is empty
    let intervalId;
    if (!searchValue || searchValue.trim() === '') {
      intervalId = setInterval(() => {
        fetchMarkers();
        //console.log('Markers fetched', filteredMarkers);
      }, 10000);
    }

    // Cleanup function to clear the interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedFilter, searchValue]); // Add both selectedFilter and searchValue to dependencies

  useEffect(() => {
    if (currentRegion && mapRef.current) {
      //console.log('[MapComponent] Animating map to current region:', currentRegion);
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  }, [currentRegion]);

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({...currentRegion, latitudeDelta: 0.025, longitudeDelta: 0.025}, 1000);
    }
  };

  const zoomToMarker = (marker) => {
    console.log('[MapComponent] Zooming to marker:', marker);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...marker.coordinate,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      );
      // New code to set the marker color when zooming in
    }
  };

  const handleMarkerPress = (marker) => {
    //console.log('[MapComponent] Marker pressed:', marker);
    zoomToMarker(marker);
  };

  // Handle map press: create a new marker and show modal
  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    const newMarker = {
      coordinate,
      title: 'New Marker',
      description: `Lat: ${coordinate.latitude}, Lon: ${coordinate.longitude}`,
      //color: markerColor, // Add the selected color to the marker
    };

    // Add the new marker to the list of markers
    //setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    //setFilteredMarkers(prevMarkers => [...prevMarkers, newMarker]);

    setModalLocation(coordinate); // Set the tapped location for the modal
    setModalVisible(true); // Show the modal

    // New code to get user_id, latitude, longitude, and address
    const userId = authState.user.id; // Get user ID from authState
    const latitude = coordinate.latitude; // Get latitude from coordinate
    const longitude = coordinate.longitude; // Get longitude from coordinate
    const address = `Lat: ${latitude}, Lon: ${longitude}`; // Example address, you may want to use a geocoding service

    // You can now use userId, latitude, longitude, and address as needed
    //console.log('User ID:', userId, 'Latitude:', latitude, 'Longitude:', longitude, 'Address:', address);
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
    setModalLocation(null); // Reset the location data
  };

  const handleImageUpload = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the user canceled the picker
    if (result.canceled) {
      //console.log("Image picker was canceled");
      return;
    }

    // Log the result to see the structure of the response
    //console.log("Image picker result:", result);

    // Set the selected image URI to the formData state
    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri; // Access the URI from the first asset
      //console.log("Selected Image:", imageUri);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: imageUri,
        pin_color: pinColor, // Ensure pin_color is updated in formData
      }));
    } else {
      // New code to handle the case where no image URI is returned
      Alert.alert("Error", "No image URI returned from the image picker.");
    }
  };

  const handlePropertyTypeSelect = (value) => {
    // Set the property type directly to the selected value
    handleInputChange("property_type", value); // Update formData with the selected property type
    console.log('Property type selected:', value); // Log the selected property type
  };

  useEffect(() => {
    console.log('Markers being rendered:', filteredMarkers.map(m => ({
      title: m.title,
      color: m.color,
      pin_color: m.pin_color
    })));
  }, [filteredMarkers]);

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
            onPress={handleMapPress} // Trigger the modal and marker creation on map press
          >
            {filteredMarkers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                onPress={() => handleMarkerPress(marker)}
                pinColor={marker.pin_color}
              >
                {/* Remove this line if not needed */}
                {/* <Text>{formatUnit(marker.unit)}</Text> */}
              </Marker>
            ))}
          </MapView>

          <TouchableOpacity style={styles.customButton} onPress={centerMapOnUser}>
            <Text><Icon name="target-two" size={25} color="#7B61FF" /></Text>
          </TouchableOpacity>

          {/* Modal for tapped location */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { padding: 20, borderRadius: 10, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }]}>
                <Text style={[styles.header, { fontSize: 24, fontWeight: 'bold', marginBottom: 15 }]}>Add New Property</Text>

                <ScrollView 
                  contentContainerStyle={styles.scrollView}
                  showsVerticalScrollIndicator={false}>
                  <Text style={styles.label}>Choose Pin Color:</Text>
                  <View style={styles.colorPickerContainer}>
                    {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FFA500', '#800080'].map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[styles.colorOption, { backgroundColor: color, borderWidth: pinColor === color ? 2 : 0 }]}
                        onPress={() => {
                          setPinColor(color);
                          console.log('Pin color set to:', color);
                        }}
                      />
                    ))}
                  </View>
                  <TextInput
                    label="Property Name"
                    value={formData.property_name}
                    onChangeText={(text) => handleInputChange("property_name", text)}
                    style={styles.input}
                  />

                  {/* Property Type Input */}
                  <View style={styles.propertyTypeContainer}>
                    <Text style={styles.label}>Property Type</Text>
                    <View style={styles.propertyTypeOptionsContainer}>
                      <View style={styles.propertyTypeRow}>
                        {propertyTypeOptions.slice(0, 2).map((option) => (
                          <TouchableOpacity 
                            key={option} 
                            onPress={() => handlePropertyTypeSelect(option)} 
                            style={[
                              styles.propertyTypeOptionButton,
                              formData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedPropertyTypeOption
                            ]}
                          >
                            <Text style={[
                              styles.optionText,
                              formData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedText
                            ]}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <View style={styles.propertyTypeRow}>
                        {propertyTypeOptions.slice(2, 4).map((option) => (
                          <TouchableOpacity 
                            key={option} 
                            onPress={() => handlePropertyTypeSelect(option)} 
                            style={[
                              styles.propertyTypeOptionButton,
                              formData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedPropertyTypeOption
                            ]}
                          >
                            <Text style={[
                              styles.optionText,
                              formData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedText
                            ]}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <Text style={styles.selectedText}>Selected Property Type: {formData.property_type}</Text>
                    {errors.property_type && <Text style={styles.errorText}>{errors.property_type}</Text>}
                  </View>

                  <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Old Seller?</Text>
                    <Switch
                      style={styles.switch}
                      value={formData.seller_already_exists}
                      onValueChange={handleSwitchChange}
                    />
                  </View>

                  <TextInput
                    label="Seller Email"
                    value={formData.seller.seller_email}
                    onChangeText={handleSellerEmailChange}
                    style={styles.input}
                  />

                  {!formData.seller_already_exists && (
                    <>
                      <TextInput
                        label="Seller First Name"
                        value={formData.seller.seller_first_name}
                        onChangeText={(text) => handleInputChange("seller", { ...formData.seller, seller_first_name: text })}
                        style={styles.input}
                      />

                      <TextInput
                        label="Seller Last Name"
                        value={formData.seller.seller_last_name}
                        onChangeText={(text) => handleInputChange("seller", { ...formData.seller, seller_last_name: text })}
                        style={styles.input}
                      />

                      <PhoneInput
                        phone={phone}
                        setPhone={(newPhone) => {
                          setPhone(newPhone);
                          handleInputChange("seller", { ...formData.seller, seller_phone_number: newPhone.fullValue });
                        }}
                        error={phone && phone.length < 10 ? "Invalid phone number" : null}
                        style={styles.input}
                      />
                    </>
                  )}

                  <AddPropertyCustomInputs
                    price={formData.price}
                    area={formData.area}
                    currency={formData.currency}
                    unit={formData.unit}
                    onPriceChange={(value) => handleInputChange("price", value)}
                    onAreaChange={(value) => handleInputChange("area", value)}
                    onCurrencyChange={(value) => handleInputChange("currency", value)}
                    onUnitChange={(value) => handleInputChange("unit", value)}
                    style={styles.input}
                  />

                  <View style={styles.countRow}>
                    <CountInput
                      label="Bedrooms"
                      value={formData.bedrooms}
                      onValueChange={(value) => handleInputChange("bedrooms", value)}
                      style={styles.countInput}
                    />
                    <CountInput
                      label="Bathrooms"
                      value={formData.bathrooms}
                      onValueChange={(value) => handleInputChange("bathrooms", value)}
                      style={styles.countInput}
                    />
                    <CountInput
                      label="Kitchens"
                      value={formData.kitchen}
                      onValueChange={(value) => handleInputChange("kitchen", value)}
                      style={styles.countInput}
                    />
                    <CountInput
                      label="Garages"
                      value={formData.garage}
                      onValueChange={(value) => handleInputChange("garage", value)}
                      style={styles.countInput}
                    />
                  </View>

                  

                </ScrollView>

                {/* Image Name Section */}
                {formData.image ? (
                  <Text style={styles.noImageText}>{formData.image.split('/').pop()}</Text> // Show the image name
                ) : (
                  <Text style={styles.noImageText}>No image selected.</Text>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleImageUpload} style={[styles.uploadButton]}>
                    <Text style={[styles.uploadButtonText]}>Upload Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={onAddPressed} style={[styles.uploadButton, { padding: 10, borderRadius: 5 }]}>
                    <Text style={styles.uploadButtonText}>Add Property</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}
