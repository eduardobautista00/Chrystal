import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
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

const { googleMapsApiKey } = getEnvVars();

export default function AddPropertiesScreen({ navigation }) {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    property_name: "House 1",
    address: "Olongapo City",
    link: "https://olongapo.com",
    latitude: "",
    longitude: "",
    price: "600",
    area: "65",
    currency: "USD",
    unit: "km2",
    bedrooms: 1,
    kitchen: 1,
    bathrooms: 1,
    garage: 1,
    user_id: authState.user.id,
    seller: {
      seller_first_name: "Seller",
      seller_last_name: "One",
      seller_phone_number: "1234567890",
      seller_address: "Olongapo City",
      seller_email: "Seller123@gmail.com"
    },
  });

  const [phone, setPhone] = useState(formData.seller.seller_phone_number);
  const [loading, setLoading] = useState(false);
  const addressChangeTimeout = useRef(null);

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
  

  const onAddPressed = () => {
    // Validation: Ensure all required fields are filled
    if (
      !formData.property_name ||
      !formData.seller?.seller_first_name ||
      !formData.seller?.seller_last_name ||
      !formData.seller?.seller_phone_number ||
      !formData.seller?.seller_address ||
      !formData.seller?.seller_email
    ) {
      Alert.alert("Validation Error", "All required fields must be filled.");
      console.log("Validation failed. Form data:", formData);
      return;
    }
  
    // Transform formData to prepare the payload
    const sanitizedData = {
      ...formData,
      seller: {
        seller_first_name: formData.seller.seller_first_name.trim(),
        seller_last_name: formData.seller.seller_last_name.trim(),
        seller_phone_number: formData.seller.seller_phone_number.trim(),
        seller_address: formData.seller.seller_address.trim(),
        seller_email: formData.seller.seller_email?.trim() || "",
      },
      link: formData.link.trim(),
    };
  
    // Debugging logs
    console.log("Sanitized Data:", sanitizedData);
  
    // Confirm navigation
    console.log("Navigating to AuthPage_AddPropertyImage");
    navigation.navigate("AuthPage_AddPropertyImage", { sanitizedData });
  };

  return (
    <AnimatedBackground>
      <View style={styles.backButtoncontainer}>
        <BackButton goBack={navigation.goBack} />
      </View>

      <Text style={styles.header}>Add New Property</Text>
      <Text style={styles.subheader}>Provide the information of the property.</Text>

      <TextInput
        label="Property Name"
        value={formData.property_name}
        onChangeText={(text) => handleInputChange("property_name", text)}
        style={styles.input}
      />

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

      <TextInput
        label="Seller Email"
        value={formData.seller.seller_email}
        onChangeText={(text) =>
          handleInputChange("seller", { ...formData.seller, seller_email: text })
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
        label="Property Address"
        value={formData.address}
        onChangeText={(text) => handleInputChange("address", text)}
        style={styles.input}
      />

      {loading && <ActivityIndicator size="large" color="#7B61FF" />}

      <AddPropertyCustomInputs
        latitude={formData.latitude}
        longitude={formData.longitude}
        price={formData.price}
        area={formData.area}
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

      <Button mode="contained" onPress={onAddPressed} style={styles.addButton}>
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
});
