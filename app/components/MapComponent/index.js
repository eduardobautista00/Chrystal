import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Platform, TouchableOpacity, 
Text, Button, Modal, TouchableWithoutFeedback, ScrollView, Image, Switch, Keyboard } from 'react-native';
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
import DropDownPicker from 'react-native-dropdown-picker';
import { useDarkMode } from '../../context/DarkModeContext';
import axios from 'axios';
import MarkerList from '../../components/MarkerList';

export default function MapComponent({ selectedFilter }) {
  const mapRef = useRef(null);
  const { property } = useData();
  const { property } = useData();
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [customFilteredMarkers, setCustomFilteredMarkers] = useState([]);
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
  const [tapMarker, setTapMarker] = useState(null); // State to store tapped marker location
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [modalLocation, setModalLocation] = useState(null); // Store location data for modal
  const { authState } = useAuth();
  const [pinColor, setPinColor] = useState('#FF0000'); // Default marker color
  const propertyTypeOptions = ['House', 'Townhouse', 'Unit', 'Land'];

  const { apiUrl } = getEnvVars();
  const { googleMapsApiKey } = getEnvVars();
  const { isDarkMode } = useDarkMode();
  const [isSearching, setIsSearching] = useState(false);

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
  const [sellers, setSellers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFilterMarkers, setSelectedFilterMarkers] = useState([]);
  const [closeList, setCloseList] = useState(false);

  // Add this function to define the initial form state
  const initialFormState = {
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
  };

  //console.log('FormData:', formData.seller_already_exists);

  // Move fetchSellers outside of useEffect
  const fetchSellers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/sellers`);
      setSellers(response.data.sellers || []);
      //console.log("Sellers fetched:", response.data.sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      Alert.alert("Error", "Unable to fetch sellers list");
      setSellers([]);
    }
  };

  useEffect(() => {
    // Initial fetch when component mounts
    fetchSellers();

    // Set up interval to fetch sellers every 10 seconds
    const intervalId = setInterval(() => {
      fetchSellers();
    }, 10000);

    // Cleanup function to clear the interval when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array means this effect runs once on mount

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

  // Add these helper functions at the component level
  const formatNumericValue = (value) => {
    // Remove all non-numeric characters except decimal point
    let cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Format with commas for thousands
    const beforeDecimal = parts[0];
    const afterDecimal = parts[1] || '';
    
    const formattedBeforeDecimal = beforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return afterDecimal ? `${formattedBeforeDecimal}.${afterDecimal}` : formattedBeforeDecimal;
  };

  const cleanNumericValue = (value) => {
    // Remove all non-numeric characters except decimal point
    return value.replace(/[^0-9.]/g, '');
  };

  const validateNumericRange = (value, field) => {
    const num = parseFloat(value);
    
    // Define maximum values based on database DECIMAL(12,2) limit
    const maxValue = 9999999999.99; // 10 digits before decimal, 2 after
    
    if (isNaN(num)) {
      Alert.alert("Invalid", `Please enter a valid number for ${field}`);
      return false;
    }

    if (num <= 0) {
      Alert.alert("Invalid", `${field.charAt(0).toUpperCase() + field.slice(1)} must be greater than 0`);
      return false;
    }

    if (num > maxValue) {
      Alert.alert("Invalid", `${field.charAt(0).toUpperCase() + field.slice(1)} value is too large. Maximum allowed is ${maxValue.toLocaleString()}`);
      return false;
    }

    // Check decimal places
    const decimalPlaces = (value.split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      Alert.alert("Invalid", `${field.charAt(0).toUpperCase() + field.slice(1)} can only have up to 2 decimal places`);
      return false;
    }
    
    return true;
  };

  const onAddPressed = async () => {
    // New code to check if all fields are filled
    const { property_name, seller, price, area, property_type, unit, currency } = formData;

    // Check if seller already exists
    if (formData.seller_already_exists) {
      // Only check for seller_email and other required fields
      if (!seller.seller_email || !property_name || !price || !area || !property_type || !unit || !currency) {
        Alert.alert("Incomplete", "Please fill in all required fields before submitting.");
        return;
      }
    } else {
      // Check all fields if seller does not already exist
      if (!property_name || !seller.seller_first_name || !seller.seller_last_name || 
          !seller.seller_email || !seller.seller_phone_number || !price || !area || !property_type || !unit || !currency) {
        Alert.alert("Incomplete", "Please fill in all fields before submitting.");
        return;
      }

      // Validate phone number format
      if (!seller.seller_phone_number || seller.seller_phone_number.length < 10) {
        Alert.alert("Invalid", "Please enter a valid phone number with at least 10 digits.");
        return;
      }
    }

    try {
      const formDataToSubmit = new FormData();

      // Append the image file only if it is provided
      if (formData.image) {
        formDataToSubmit.append('image_url', {
          uri: formData.image,
          type: formData.image.type || 'image/jpeg',
          name: formData.image.name || 'property_image',
        });
      }

      // Only include seller_id if seller already exists
      if (formData.seller_already_exists) {
        if (!formData.seller_id) {
          Alert.alert("Error", "Please select an existing seller.");
          return;
        }
        formDataToSubmit.append('seller_id', formData.seller_id);
      } else {
        // For new sellers, append seller information directly
        Object.keys(formData.seller).forEach((key) => {
          formDataToSubmit.append(key, formData.seller[key]);
        });
      }

      // Append other property data
      const { seller, seller_id, ...restData } = formData;
      Object.keys(restData).forEach((key) => {
        formDataToSubmit.append(key, restData[key]);
      });

      // Add location data
      const userId = authState.user.id;
      const latitude = modalLocation.latitude;
      const longitude = modalLocation.longitude;
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;
      
      const geocodeResponse = await axios.get(geocodeUrl);
      const address = geocodeResponse.data.results[0]?.formatted_address || 'Address not found';

      formDataToSubmit.append('user_id', userId);
      formDataToSubmit.append('latitude', latitude);
      formDataToSubmit.append('longitude', longitude);
      formDataToSubmit.append('address', address);
      formDataToSubmit.append('pin_color', pinColor);
      formDataToSubmit.append('property_type', formData.property_type);

      // Clean and validate numeric values
      const cleanPrice = cleanNumericValue(formData.price);
      const cleanArea = cleanNumericValue(formData.area);

      if (!validateNumericRange(cleanPrice, 'price')) return;
      if (!validateNumericRange(cleanArea, 'area')) return;

      formDataToSubmit.append('price', cleanPrice);
      formDataToSubmit.append('area', cleanArea);

      const response = await property.addProperty(formDataToSubmit);
      console.log('Response:', response);

      // Check if the "error" field contains a success message
      if (response.error && response.error.includes("Property created successfully")) {
        Alert.alert("Success", "Your property details have been submitted. Wait for approval.");
        closeModal();
        setFormData(initialFormState);
        fetchMarkers();
      } else if (response.error && response.error.includes("422")) {
        Alert.alert("Validation Error", "Please check your input values. One or more fields are invalid.");
        console.log('Validation error response:', response);
      } else {
        Alert.alert("Failed to add property", response.error || "An unknown error occurred");
        console.log('Unhandled response:', response);
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response && error.response.data) {
        if (error.response.status === 422) {
          const errorMessages = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          Alert.alert("Validation Error", errorMessages);
        } else {
          Alert.alert("Error", error.response.data.message || "An error occurred while submitting the form.");
        }
      } else {
        Alert.alert("Error", error.message || "An error occurred while submitting the form.");
      }
    }
  };

  const handleSwitchChange = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      seller_already_exists: !prevFormData.seller_already_exists,
    }));
    
    // Log the state of the switch
    console.log("Seller already exists:", !formData.seller_already_exists);

    if (!formData.seller_already_exists) {
      // Reset seller info if switching to new seller
      setFormData((prevFormData) => ({
        ...prevFormData,
        seller: {
          seller_first_name: "",
          seller_last_name: "",
          seller_phone_number: "",
          seller_address: "",
          seller_email: "", // Keep email
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
    setSearchValue(text);
    if (text.length > 0) {
      const searchResults = filteredMarkers.filter(marker =>
        (marker.title?.toLowerCase() || '').includes(text.toLowerCase()) ||
        (marker.description?.toLowerCase() || '').includes(text.toLowerCase())
      );
      setSelectedFilterMarkers(searchResults);
    } else {
      setSelectedFilterMarkers([]);
    }
  };

  const centerMapOnUser = () => {
  
    //console.log('[MapComponent] Centering map on user location');
  
    //console.log('[MapComponent] Centering map on user location');
    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  const handleClear = async () => {
    //console.log('[MapComponent] Clearing search and filters');
    //console.log('[MapComponent] Clearing search and filters');
    setSearchValue('');
    setSelectedFilters([]);
    setFilteredMarkers(markers);

    if (mapRef.current && currentRegion) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  const handleSearchSubmit = () => {
    const cleanedSearchValue = searchValue.trim().replace(/\s+/g, ' ').toLowerCase();
    
    const markersToSearch = selectedFilter && Object.keys(selectedFilter).length > 0 
      ? selectedFilterMarkers 
      : markers;

    const searchedMarkers = markersToSearch.filter(marker => {
      const markerDescriptionCleaned = marker.description.trim().replace(/\s+/g, ' ').toLowerCase();
      const markerTitleCleaned = marker.title.trim().replace(/\s+/g, ' ').toLowerCase();
      
      const isMatch = selectedFilters.every(filter =>
        markerDescriptionCleaned.includes(filter.trim().replace(/\s+/g, ' ').toLowerCase())
      );

      return markerTitleCleaned.includes(cleanedSearchValue) && isMatch;
    }).map(marker => {
      // Find the original marker to ensure we get the correct pinColor
      const originalMarker = markers.find(m => 
        m.coordinate.latitude === marker.coordinate.latitude && 
        m.coordinate.longitude === marker.coordinate.longitude
      );
      
      return {
        ...marker,
        pinColor: originalMarker ? originalMarker.pinColor : marker.pinColor,
        originalPinColor: originalMarker ? originalMarker.originalPinColor : marker.pinColor
      };
    });

    setFilteredMarkers(searchedMarkers);

    if (searchedMarkers.length > 0) {
      const firstMarker = searchedMarkers[0];
      zoomToMarker(firstMarker);
    } else {
      Alert.alert('No results found', 'No properties matched your search.');
    }
  };
  };

  const handleFilterToggle = (filter) => {
    //console.log('[MapComponent] Toggling filter:', filter);
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

      //console.log('[MapComponent] Requesting user location...');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      //console.log('[MapComponent] Location permission granted.');
      //console.log('[MapComponent] Location permission granted.');

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 20000,
      });

      //console.log('[MapComponent] Fetched location:', location);
      //console.log('[MapComponent] Fetched location:', location);

      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setCurrentRegion(userRegion);
      //console.log('[MapComponent] Updated region to user location:', userRegion);
      //console.log('[MapComponent] Updated region to user location:', userRegion);
    } catch (error) {
      //console.error('[MapComponent] Error fetching location:', error);
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
    //console.log('[MapComponent] Set default region:', defaultRegion);
    fetchUserLocation();
  }, []);

  const filterMarkersBySelectedFilters = (extractedMarkers) => {
    if (selectedFilter && Object.keys(selectedFilter).length > 0) {
      const { areaRange, priceRange, property_type, pinColor, currency, unit } = selectedFilter;
      
      let filteredMarkers = extractedMarkers.map(marker => ({
        ...marker,
        pinColor: marker.originalPinColor || marker.pinColor
      }));

      if (pinColor) {
        filteredMarkers = filteredMarkers.map(marker => ({
          ...marker,
          pinColor: pinColor
        }));
      }

      if (Array.isArray(property_type) && property_type.length > 0) {
        filteredMarkers = filteredMarkers.filter(marker => 
          marker.property_type && property_type.includes(marker.property_type)
        );
      }

      if (Array.isArray(currency) && Array.isArray(unit) && currency.length > 0 && unit.length > 0) {
        filteredMarkers = filteredMarkers.filter(marker => {
          const markerUnit = formatUnit(marker.unit);
          const formattedUnits = unit.map(formatUnit);
          return currency.includes(marker.currency) && formattedUnits.includes(markerUnit);
        });
      }

      if (priceRange) {
        filteredMarkers = filteredMarkers.filter(marker => {
          const markerPrice = parseFloat(marker.price);
          return !isNaN(markerPrice) && 
                 markerPrice >= priceRange[0] && 
                 markerPrice <= priceRange[1];
        });
      }

      if (areaRange) {
        filteredMarkers = filteredMarkers.filter(marker => {
          const markerArea = parseFloat(marker.area);
          return !isNaN(markerArea) && 
                 markerArea >= areaRange[0] && 
                 markerArea <= areaRange[1];
        });
      }

      setSelectedFilterMarkers(filteredMarkers);
      setFilteredMarkers(filteredMarkers);
    } else {
      const markersWithOriginalColors = markers.map(marker => ({
        ...marker,
        pinColor: marker.originalPinColor || marker.pinColor
      }));
      setSelectedFilterMarkers([]);
      setFilteredMarkers(markersWithOriginalColors);
    }
  };

  const fetchMarkers = async () => {
    try {
      if (!authState?.user?.id) {
        console.error('[MapComponent] Error: User not logged in');
        return;
      }

      const response = await fetch(`${apiUrl}/properties`);
      const data = await response.json();

      if (response.ok && data && data.property) {
        const userProperties = data.property.filter(property => 
          property.status === 'available' && 
          (property.user_id === authState.user.id || property.user_id === 1)
        );

        const extractedMarkers = userProperties.map((property) => ({
          coordinate: {
            latitude: parseFloat(property.latitude),
            longitude: parseFloat(property.longitude),
          },
          title: property.property_name || 'Unknown',
          description: property.address || 'No Address',
          pinColor: property.pin_color || "#FF0000", // Ensure pin_color is properly mapped
          area: property.area,
          price: property.price,
          currency: property.currency,
          unit: property.unit,
          property_type: property.property_type,
          originalPinColor: property.pin_color || "#FF0000" // Keep track of original color
        }));

        setMarkers(extractedMarkers);
        filterMarkersBySelectedFilters(extractedMarkers);
        setIsMarkersFetched(true);
      } else {
        console.error('[MapComponent] Error: Invalid response structure', data);
      }
    } catch (error) {
      console.error('[MapComponent] Error fetching markers:', error);
    }
  };

  // Add a new useEffect for initial fetch
  useEffect(() => {
    fetchMarkers();
  }, []); // Empty dependency array means this runs once on mount

  // Modify the existing useEffect for polling
  useEffect(() => {
    //zoomOut();
    filterMarkersBySelectedFilters(markers);

    // Only set up the interval if searchValue is empty
    let intervalId;
    if (!searchValue || searchValue.trim() === '') {
      intervalId = setInterval(() => {
        fetchMarkers();
      }, 10000);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedFilter, searchValue, markers]); // Include markers in dependencies

  useEffect(() => {
    if (currentRegion && mapRef.current) {
      //console.log('[MapComponent] Animating map to current region:', currentRegion);
      //console.log('[MapComponent] Animating map to current region:', currentRegion);
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  }, [currentRegion]);

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({...currentRegion, latitudeDelta: 0.025, longitudeDelta: 0.025}, 1000);
  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({...currentRegion, latitudeDelta: 0.025, longitudeDelta: 0.025}, 1000);
    }
  };
  };

  const zoomToMarker = (marker) => {
    console.log('[MapComponent] Zooming to marker:', marker);
    if (mapRef.current) {
      // Store the original marker color before zooming
      const originalMarker = markers.find(m => 
        m.coordinate.latitude === marker.coordinate.latitude && 
        m.coordinate.longitude === marker.coordinate.longitude
      );
      
      mapRef.current.animateToRegion({
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      });

      // Ensure the marker keeps its original color
      if (originalMarker) {
        const updatedMarkers = filteredMarkers.map(m => 
          m.coordinate.latitude === marker.coordinate.latitude && 
          m.coordinate.longitude === marker.coordinate.longitude 
            ? { ...m, pinColor: originalMarker.pinColor }
            : m
        );
        setFilteredMarkers(updatedMarkers);
      }
    }
  };

  const handleMarkerPress = (marker) => {
    if (marker && marker.coordinate) {
      mapRef.current?.animateToRegion({
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
    handleSearchFocus(false);
  };


  // Modify the handleMapPress function
  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    const newMarker = {
      coordinate,
      title: 'New Marker',
      description: `Lat: ${coordinate.latitude}, Lon: ${coordinate.longitude}`,
    };


    // Reset form data to initial state
    setFormData(initialFormState);
    setPhone(""); // Reset phone state
    setPinColor('#FF0000'); // Reset pin color to default
    setOpen(false); // Reset dropdown state if needed

    setModalLocation(coordinate);
    setModalVisible(true);
    fetchSellers();

    const userId = authState.user.id;
    const latitude = coordinate.latitude;
    const longitude = coordinate.longitude;
    const address = `Lat: ${latitude}, Lon: ${longitude}`;
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
        pinColor: pinColor, // Ensure pinColor is updated in formData
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
    //console.log('Markers being rendered:', filteredMarkers.map(m => ({
      //title: m.title,
      //color: m.color,
      //pinColor: m.pinColor
    //})));
  }, [filteredMarkers]);

  useEffect(() => {
    return () => {
      setMarkers([]);
      setFilteredMarkers([]);
      setSelectedFilterMarkers([]);
    };
  }, []);

  const handleSearchFocus = (focused) => {
    setIsSearching(focused);
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
              hasFilteredMarkers={selectedFilterMarkers.length > 0}
              onFocus={() => handleSearchFocus(true)}
            />
            <MarkerList 
              markers={selectedFilterMarkers}
              onMarkerPress={handleMarkerPress}
              visible={selectedFilter && Object.keys(selectedFilter).length > 0 && isSearching}
            />
            <MapView
              style={[styles.map, isDarkMode && { backgroundColor: '#1A1A1A' }]}
              ref={mapRef}
              region={currentRegion}
              showsUserLocation
              showsMyLocationButton={false}
              provider={PROVIDER_GOOGLE}
              onPress={(event) => {
                handleMapPress(event);
                handleSearchFocus(false);
              }}
              customMapStyle={isDarkMode ? styles.darkMapStyle : styles.lightMapStyle}
            >
              {filteredMarkers.map((marker, index) => {
                console.log('Rendering markers:', {
                  title: marker.title,
                  pinColor: marker.pinColor,
                  coordinate: marker.coordinate,
                  type: marker.property_type
                });
                
                return (
                  <Marker
                    key={index}
                    coordinate={marker.coordinate}
                    title={marker.title}
                    description={marker.description}
                    onPress={() => handleMarkerPress(marker)}
                    pinColor={marker.pinColor}
                  />
                );
              })}
            </MapView>

            <TouchableOpacity style={[styles.customButton, isDarkMode && { backgroundColor: '#1A1A1A', borderColor: '#fff', borderWidth: 1 }]} onPress={centerMapOnUser}>
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
                <View style={[styles.modalContent, isDarkMode && { backgroundColor: '#1A1A1A', borderColor: '#fff', borderWidth: 0 }]}>
                  <Text style={[styles.header, { fontSize: 24, fontWeight: 'bold', marginBottom: 15 }, isDarkMode && { color: '#fff' }]}>Add New Property</Text>

                  <ScrollView 
                    contentContainerStyle={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
                    <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Choose Pin Color:</Text>
                    <View style={styles.colorPickerContainer}>
                      {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FFA500', '#800080'].map(color => (
                        <TouchableOpacity
                          key={color}
                          style={[styles.colorOption, { backgroundColor: color, borderWidth: pinColor === color ? 2 : 0 }, isDarkMode && { borderColor: '#fff' }]}
                          onPress={() => {
                            setPinColor(color);
                            console.log('Pin color set to:', pinColor);
                          }}
                        />
                      ))}
                    </View>
                    <TextInput
                      label="Property Name"
                      value={formData.property_name}
                      onChangeText={(text) => handleInputChange("property_name", text)}
                      style={[styles.input, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                    />

                    {/* Property Type Input */}
                    <View style={styles.propertyTypeContainer}>
                      <Text style={[styles.label, isDarkMode && { color: '#fff' }]}>Property Type</Text>
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
                      {errors.property_type && <Text style={styles.errorText}>{errors.property_type}</Text>}
                    </View>

                    <View style={styles.switchContainer}>
                      <Text style={[styles.switchLabel, isDarkMode && { color: '#fff' }]}>Existing Seller?</Text>
                      <Switch
                        style={styles.switch}
                        value={formData.seller_already_exists}
                        onValueChange={handleSwitchChange}
                        trackColor={{ false: "#767577", true: "#7B61FF" }}
                        thumbColor= '#7B61FF'
                      />
                    </View>

                    {formData.seller_already_exists ? (
                      <View style={styles.dropdownContainer}>
                        {/*<Text style={styles.label}>Select Seller</Text>*/}
                        <DropDownPicker
                          theme={isDarkMode ? 'DARK' : 'LIGHT'}
                          open={open}
                          setOpen={setOpen}
                          items={sellers.map(seller => ({
                            label: `${seller.seller_first_name} ${seller.seller_last_name}`,
                            labelStyle: { color: isDarkMode ? '#fff' : '#000' },
                            value: seller.id
                          }))}
                          value={formData.seller_id}
                          setValue={(callback) => {
                            const newValue = callback(formData.seller_id);
                            if (newValue && sellers) {
                              const selectedSeller = sellers.find(s => s.id === newValue);
                              if (selectedSeller) {
                                setFormData(prev => ({
                                  ...prev,
                                  seller_id: newValue,
                                  seller: {
                                    ...prev.seller,
                                    seller_email: selectedSeller.seller_email,
                                    seller_first_name: selectedSeller.seller_first_name,
                                    seller_last_name: selectedSeller.seller_last_name,
                                    seller_phone_number: selectedSeller.seller_phone_number,
                                    seller_address: selectedSeller.seller_address,
                                  }
                                }));
                              }
                            }
                          }}
                          placeholder="Select a seller..."
                          placeholderStyle={[styles.placeholder, isDarkMode && { color: '#fff' }]}
                          style={[styles.dropdown, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A', borderColor: '#fff', borderWidth: 1 }]}
                          dropDownContainerStyle={[styles.dropDownContainer, isDarkMode && { backgroundColor: '#1A1A1A', borderColor: '#fff', borderWidth: 1 }]}
                          searchable={true}
                          searchPlaceholder="Search for a seller"
                          searchPlaceholderTextColor={isDarkMode ? '#fff' : '#000'}
                          searchTextInputStyle={[styles.searchTextInput, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A', borderColor: '#fff', borderWidth: 1 }]}
                          listMode="SCROLLVIEW"
                          scrollViewProps={{
                            nestedScrollEnabled: true,
                            showsVerticalScrollIndicator: false
                          }}
                        />
                      </View>
                    ) : (
                      <TextInput
                        label="Seller Email"
                        value={formData.seller.seller_email}
                        onChangeText={(text) =>
                          handleInputChange("seller", { ...formData.seller, seller_email: text })
                        }
                        style={[styles.input, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                      />
                    )}

                    {!formData.seller_already_exists && (
                      <>
                        <TextInput
                          label="Seller First Name"
                          value={formData.seller.seller_first_name}
                          onChangeText={(text) => handleInputChange("seller", { ...formData.seller, seller_first_name: text })}
                          style={[styles.input, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                        />

                        <TextInput
                          label="Seller Last Name"
                          value={formData.seller.seller_last_name}
                          onChangeText={(text) => handleInputChange("seller", { ...formData.seller, seller_last_name: text })}
                          style={[styles.input, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                        />

                        <PhoneInput
                          phone={phone}
                          setPhone={(newPhone) => {
                            setPhone(newPhone);
                            handleInputChange("seller", { ...formData.seller, seller_phone_number: newPhone.fullValue });
                          }}
                          error={phone && phone.length < 10 ? "Invalid phone number" : null}
                          style={[styles.input, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
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
                      style={[styles.input, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                    />

                    <View style={styles.countRow}>
                      <CountInput
                        label="Bedrooms"
                        value={formData.bedrooms}
                        onValueChange={(value) => handleInputChange("bedrooms", value)}
                        style={[styles.countInput, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                      />
                      <CountInput
                        label="Bathrooms"
                        value={formData.bathrooms}
                        onValueChange={(value) => handleInputChange("bathrooms", value)}
                        style={[styles.countInput, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                      />
                      <CountInput
                        label="Kitchens"
                        value={formData.kitchen}
                        onValueChange={(value) => handleInputChange("kitchen", value)}
                        style={[styles.countInput, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
                      />
                      <CountInput
                        label="Garages"
                        value={formData.garage}
                        onValueChange={(value) => handleInputChange("garage", value)}
                        style={[styles.countInput, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A' }]}
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
                      <Text style={[styles.closeButtonText, isDarkMode && { color: '#ff0000' }]}>Close</Text>
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
