import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Switch, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import CountInput from "../../components/CountInput";
import AddPropertyCustomInputs from "../../components/AddPropertyCustomInputs";
import { useData } from "../../context/DataContext";
import AnimatedBackground from "../../components/AnimatedBackground";
import BackButton from "../../components/BackButton";
import PhoneInput from "../../components/PhoneInput";
import getEnvVars from "../../config/env";
import { useAuth } from "../../context/AuthContext";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { theme } from "../../core/theme";
import DropDownPicker from 'react-native-dropdown-picker';
import { useDarkMode } from "../../context/DarkModeContext";

import axios from "axios";

export default function AddPropertiesScreen({ navigation }) {
  const { authState } = useAuth();
  const { isDarkMode } = useDarkMode();
  const { googleMapsApiKey } = getEnvVars();
  const { apiUrl }   = getEnvVars();
  const [pinColor, setPinColor] = useState('#FF0000'); // Default marker color
  const propertyTypeOptions = ['House', 'Townhouse', 'Unit', 'Land'];
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    property_name: "",
    address: "",
    link: "",
    latitude: "",
    longitude: "",
    price: "",
    area: "",
    currency: "USD",
    unit: "m2",
    bedrooms: 1,
    kitchen: 1,
    bathrooms: 1,
    garage: 1,
    seller_already_exists: false,
    user_id: authState.user.id,
    seller_id: null, // Ensure seller_id is null
    seller: {
      seller_first_name: "",
      seller_last_name: "",
      seller_phone_number: "",
      seller_address: "",
      seller_email: ""
    },
    property_type: "",
  });

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const addressChangeTimeout = useRef(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [open, setOpen] = useState(false);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    // Fetch sellers when component mounts
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sellers`);
        setSellers(response.data.sellers || []);
        console.log("Sellers fetched:", response.data.sellers);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        Alert.alert("Error", "Unable to fetch sellers list");
        setSellers([]);
      }
    };
  
    fetchSellers();
  }, []);

  const handlePropertyTypeSelect = (value) => {
    // Set the property type directly to the selected value
    handleInputChange("property_type", value); // Update formData with the selected property type
    console.log('Property type selected:', value); // Log the selected property type
  };

  const handleInputChange = (field, value) => {
    console.log('latitude and longitude', formData.latitude, formData.longitude);
    setFormData((prevFormData) => {
      if (field === "address") {
        clearTimeout(addressChangeTimeout.current);
  
        // If address is cleared, reset latitude and longitude
        if (value.trim() === "") {
          return {
            ...prevFormData,
            address: value,
            latitude: "",
            longitude: "",
            seller: {
              ...prevFormData.seller,
              seller_address: value,
            },
          };
        }
  
        // Debounce the address change to avoid excessive API calls
        addressChangeTimeout.current = setTimeout(() => {
          fetchCoordinates(value);
        }, 1000); // 1 second debounce
  
        return {
          ...prevFormData,
          address: value,
          seller: {
            ...prevFormData.seller,
            seller_address: value,
          },
        };
      }
  
      // Handle other fields
      return {
        ...prevFormData,
        [field]: value,
      };
    });
  };
  
  const fetchCoordinates = async (address) => {
    if (!address.trim()) {
      Alert.alert(
        "Invalid Address",
        "The address field is empty. Please enter a valid address."
      );
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${googleMapsApiKey}`
      );
  
      const data = await response.json();
  
      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
  
        // Automatically update latitude and longitude in formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          latitude: lat.toFixed(4),
          longitude: lng.toFixed(4),
          
        }));
      } else {
        Alert.alert(
          "Address Not Found",
          "No results found for the entered address. Please check and try again."
        );
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      Alert.alert("Error", "Unable to fetch coordinates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  // Add these helper functions after the useState declarations
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
    // Existing validation code
    if (!formData.property_name || !formData.property_type || !formData.address) {
      Alert.alert("Incomplete Form", "Please fill in all required property fields.");
      console.log("Validation failed. Form data:", formData);
      return;
    }

    try {
      // Clean and format price and area values
      const cleanPrice = cleanNumericValue(formData.price);
      const cleanArea = cleanNumericValue(formData.area);

      // Validate numeric ranges before proceeding
      if (!validateNumericRange(cleanPrice, 'price')) return;
      if (!validateNumericRange(cleanArea, 'area')) return;

      // Format for display (if needed)
      const formattedPrice = formatNumericValue(cleanPrice);
      const formattedArea = formatNumericValue(cleanArea);

      // Log the cleaned and formatted values
      console.log('Clean Price:', cleanPrice);
      console.log('Formatted Price:', formattedPrice);
      console.log('Clean Area:', cleanArea);
      console.log('Formatted Area:', formattedArea);

      // Update formData with cleaned values
      const updatedFormData = {
        ...formData,
        price: cleanPrice,
        area: cleanArea
      };

      // Navigate to the next screen with the cleaned and validated data
      navigation.navigate("AddPropertyImage", { 
        sanitizedData: updatedFormData 
      });
      console.log('Updated form data:', updatedFormData);

    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.error && error.response.data.error.includes('Out of range value')) {
          Alert.alert(
            "Invalid Value",
            "The price or area value exceeds the maximum limit of 9,999,999,999.99"
          );
        } else {
          Alert.alert("Error", error.response.data.message || "An error occurred while submitting the form.");
        }
      } else {
        Alert.alert("Error", error.message || "An error occurred while submitting the form.");
      }
      console.error("Submission error:", error);
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
    clearTimeout(addressChangeTimeout.current);

    // Set a new timeout to check seller details after a delay
    addressChangeTimeout.current = setTimeout(async () => {
      // If sellerAlreadyExists is true, fetch seller details by email
      if (formData.seller_already_exists) {
        try {
          const response = await axios.get(`${apiUrl}/get-seller-by-email`, {
            params: {
              email: value, // Use the updated email value
            },
          });
          console.log("Response:", response.data);

          // Check if the response indicates that the seller exists
          if (response.data && response.data.exists) {
            const sellerData = response.data; // Assuming seller data is in the response
            console.log("Fetched Seller Data:", sellerData);
            // Update formData with fetched seller details
            setFormData((prevFormData) => ({
              ...prevFormData,
              seller_id: sellerData.seller_id, // Pass seller_id
              seller_already_exists: true, // Set to true since the seller exists
            }));
            setIsEmailValid(true); // Email is valid
          } else {
            // Handle case where seller does not exist
            Alert.alert("Error", "Seller does not exist.");
            setIsEmailValid(false); // Email is invalid
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
      } else {
        setIsEmailValid(true); // If seller does not already exist, consider email valid for the purpose of adding a new seller
      }
    }, 3000); // 3 seconds delay
  };

  return (
    <AnimatedBackground isDarkMode={isDarkMode}>
      <View style={styles.backButtoncontainer}>
        <BackButton goBack={navigation.goBack} isDarkMode={isDarkMode} />
      </View>

      <Text style={styles.header}>Add New Property</Text>
      <Text style={[styles.subheader, isDarkMode && { color: '#FFFFFF' }]}>Provide the information of the property.</Text>

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
        style={[styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#FFFFFF' }]}
        textColor={isDarkMode ? '#FFFFFF' : '#000000'}
      />
      
      <GooglePlacesAutocomplete
        onPress={(data, details = null) => {
          const address = data.description;
          handleInputChange("address", address);
          if (details) {
            const { lat, lng } = details.geometry.location;
            setFormData(prev => ({
              ...prev,
              latitude: lat.toFixed(4),
              longitude: lng.toFixed(4),
            }));
          }
        }}
        query={{
          key: googleMapsApiKey,
          language: 'en',
          types: 'geocode', // Changed from 'address' to 'geocode' for more precise results
          
          
        }}
        enablePoweredByContainer={false}
        fetchDetails={true}
        styles={{
          container: {
            flex: 0,
            //marginTop: 20,
            zIndex: 1, // Ensure container is above other elements
          },
          textInputContainer: {
            width: '100%',
          },
          textInput: {
            // Remove default text input styles as they'll be handled by your custom component
          },
          listView: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
            borderRadius: 4,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            elevation: 3,
            zIndex: 2, // Ensure suggestions appear above other elements
            position: 'absolute',
            top: 70,
            left: 0,
            right: 0,
            maxHeight: 200, // Limit height of suggestions
          },
          row: {
            padding: 13,
            height: 44,
          },
        }}
        listViewDisplayed='auto'
        minLength={3} // Start showing suggestions after 3 characters
        returnKeyType={'search'}
        keyboardShouldPersistTaps='always'
        scrollEnabled={false}
        textInputProps={{
          InputComp: TextInput,
          label: "Property Address",
          style: [styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#FFFFFF'}],
          textColor: isDarkMode ? '#FFFFFF' : '#000000',
        }}
        
      />

      {loading && <ActivityIndicator size="large" color="#7B61FF" />}

      {/* Property Type Input */}
      <View style={styles.propertyTypeContainer}>
        <Text style={[styles.label, isDarkMode && { color: '#FFFFFF' }]}>Property Type</Text>
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
        <Text style={[styles.switchLabel, isDarkMode && { color: '#FFFFFF' }]}>Existing Seller?</Text>
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
          style={[styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#FFFFFF' }]}
          textColor={isDarkMode ? '#FFFFFF' : '#000000'}
        />
      )}

      {!formData.seller_already_exists && (
        <>
          <TextInput
            label="Seller First Name"
            value={formData.seller.seller_first_name}
            onChangeText={(text) =>
              handleInputChange("seller", { ...formData.seller, seller_first_name: text })
            }
            style={[styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#FFFFFF' }]}
            textColor={isDarkMode ? '#FFFFFF' : '#000000'}
          />

          <TextInput
            label="Seller Last Name"
            value={formData.seller.seller_last_name}
            onChangeText={(text) =>
              handleInputChange("seller", { ...formData.seller, seller_last_name: text })
            }
            style={[styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#FFFFFF' }]}
            textColor={isDarkMode ? '#FFFFFF' : '#000000'}
          />

          <PhoneInput
            phone={phone}
            setPhone={(newPhone) => {
              setPhone(newPhone);
              handleInputChange("seller", {
                ...formData.seller,
                seller_phone_number: newPhone.fullValue,
              });
            }}
            error={phone && phone.length < 10 ? "Invalid phone number" : null}
            style={[styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#FFFFFF' }]}
            textColor={isDarkMode ? '#FFFFFF' : '#000000'}
          />

          <TextInput
            label="Seller Address"
            value={formData.seller.seller_address}
            onChangeText={(text) =>
              handleInputChange("seller", { ...formData.seller, seller_address: text })
            }
            style={[styles.input, isDarkMode && { backgroundColor: '#1a1a1a', color: '#FFFFFF' }]}
            textColor={isDarkMode ? '#FFFFFF' : '#000000'}
          />
        </>
      )}

      <AddPropertyCustomInputs
        latitude={formData.latitude}
        longitude={formData.longitude}
        price={formData.price}
        area={formData.area}
        currency={formData.currency}
        unit={formData.unit}
        onPriceChange={(value) => handleInputChange("price", value)}
        onAreaChange={(value) => handleInputChange("area", value)}
        onCurrencyChange={(value) => handleInputChange("currency", value)}
        onUnitChange={(value) => handleInputChange("unit", value)}
      />

      <View style={styles.countRow}>
        <CountInput
          label="Bedrooms"
          value={formData.bedrooms}
          onValueChange={(value) => handleInputChange("bedrooms", value)}
        />
        <CountInput
          label="Bathrooms"
          value={formData.bathrooms}
          onValueChange={(value) => handleInputChange("bathrooms", value)}
        />
        <CountInput
          label="Kitchens"
          value={formData.kitchen}
          onValueChange={(value) => handleInputChange("kitchen", value)}
        />
        <CountInput
          label="Garages"
          value={formData.garage}
          onValueChange={(value) => handleInputChange("garage", value)}
        />
      </View>

      <Button 
        mode="contained" 
        onPress={onAddPressed} 
        style={styles.addButton} 
        //disabled={!isEmailValid || (formData.seller_already_exists && !formData.seller_id)}
      >
        Add Image
      </Button>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: "Bold",
    color: "#7B61FF",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 15,
    color: "#555",
  },
  input: {
    marginBottom: -20,
    height: 64,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#aaa",
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  addButton: {
    marginTop: 10,
  },
  backButtoncontainer: {
    paddingTop: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth: 1,
    //borderColor: 'red',
    //marginTop: 15,
    marginBottom: '-10',
  },
  switchLabel: {
    marginRight: 10,
  },
  switch: {
    //marginTop: '-10',
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginTop: 10,
  },
  coverageOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    //paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: 'center',
    width: '30%'
  },
  propertyTypeOptionsContainer: {
    //marginBottom: 10,
    //marginTop: 10,
  },
  propertyTypeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  propertyTypeOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    //paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: 'center',
    width: '50%',
  },
  optionText: {
    color: '#FFFFFF',
  },
  coverageContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  coverageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyTypeContainer: {
    //marginBottom: 10,
    marginTop: 30,
  },
  propertyTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  selectedCoverageOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  selectedPropertyTypeOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  selectedButton: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  selectedText: {
    color: '#7B61FF',
  },
  dropdownContainer: {
    marginBottom: 5,
    zIndex: 1000,
    elevation: 1000, // Add this for Android
  },
  dropdown: {
    marginTop: 8,
    borderColor: '#000',
    borderRadius: 4,
  },
  dropDownContainer: {
    borderColor: '#000',
    borderRadius: 4,
    maxHeight: 300, // Limit the height of the dropdown
  },
});
