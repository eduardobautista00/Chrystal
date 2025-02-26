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

import axios from "axios";

export default function AddPropertiesScreen({ navigation }) {
  const { authState } = useAuth();
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
    unit: "km2",
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
  

  const onAddPressed = async () => {
    
    // Validation: Ensure all required fields are filled
    if (
      !formData.property_name ||
      !formData.seller?.seller_email ||
      !formData.property_type ||
      //(!formData.seller_already_exists && !formData.seller?.seller_id) || // Ensure seller_id is present only if seller does not exist
      (!formData.seller_already_exists && !formData.seller?.seller_first_name) ||
      (!formData.seller_already_exists && !formData.seller?.seller_last_name) ||
      (!formData.seller_already_exists && !formData.seller?.seller_phone_number) ||
      (!formData.seller_already_exists && !formData.seller?.seller_address)
    ) {
      Alert.alert("Incomplete Form", "Please fill in all required fields before submitting.");
      console.log("Validation failed. Form data:", formData);
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.seller.seller_email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }
  
    // Transform formData to prepare the payload
    const sanitizedData = {
      property_name: formData.property_name,
      address: formData.address,
      price: formData.price,
      currency: formData.currency,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      kitchen: formData.kitchen,
      garage: formData.garage,
      area: formData.area,
      unit: formData.unit,
      latitude: formData.latitude,
      longitude: formData.longitude,
      user_id: formData.user_id,
      property_type: formData.property_type,
      pin_color: pinColor,
      //seller_id: formData.seller_id,
      seller_already_exists: formData.seller_already_exists,
      ...(formData.seller_already_exists && { seller_id: formData.seller_id }), // Include seller_id if exists
      ...(!formData.seller_already_exists && { // Include seller details if does not exist
          seller_email: formData.seller.seller_email,
          seller_first_name: formData.seller.seller_first_name,
          seller_last_name: formData.seller.seller_last_name,
          seller_phone_number: formData.seller.seller_phone_number,
          seller_address: formData.seller.seller_address,
      }),
    };
  
    // Debugging logs
    console.log("Sanitized Data:", sanitizedData);
  
    // Confirm navigation
    console.log("Navigating to AddPropertyImage");
    navigation.navigate("AddPropertyImage", { sanitizedData });
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
    <AnimatedBackground>
      <View style={styles.backButtoncontainer}>
        <BackButton goBack={navigation.goBack} />
      </View>

      <Text style={styles.header}>Add New Property</Text>
      <Text style={styles.subheader}>Provide the information of the property.</Text>

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
      
      <TextInput
        label="Property Address"
        value={formData.address}
        onChangeText={(text) => handleInputChange("address", text)}
        style={styles.input}
      />

      {loading && <ActivityIndicator size="large" color="#7B61FF" />}

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
            onChangeText={(text) =>
              handleInputChange("seller", { ...formData.seller, seller_first_name: text })
            }
            style={styles.input}
          />

          <TextInput
            label="Seller Last Name"
            value={formData.seller.seller_last_name}
            onChangeText={(text) =>
              handleInputChange("seller", { ...formData.seller, seller_last_name: text })
            }
            style={styles.input}
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
            style={styles.input}
          />

          <TextInput
            label="Seller Address"
            value={formData.seller.seller_address}
            onChangeText={(text) =>
              handleInputChange("seller", { ...formData.seller, seller_address: text })
            }
            style={styles.input}
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
        Add Images
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
    marginTop: 15,
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
    marginBottom: 10,
    marginTop: 10,
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
});
