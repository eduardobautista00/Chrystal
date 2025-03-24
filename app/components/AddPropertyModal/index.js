import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Alert, Text, ScrollView, TouchableOpacity } from "react-native";
import TextInput from "../TextInput";
import Button from "../Button";
import CountInput from "../CountInput";
import AddPropertyCustomInputs from "../AddPropertyCustomInputs";
import { useAuth } from "../../context/AuthContext";
import PhoneInput from "../PhoneInput";
import getEnvVars from "../../config/env";
import styles from "./styles"; // Import the styles

const { googleMapsApiKey } = getEnvVars();

export default function AddPropertyModal({ closeModal, onAddProperty }) {
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
    setFormData((prevFormData) => {
      if (field === "address") {
        clearTimeout(addressChangeTimeout.current);

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

        addressChangeTimeout.current = setTimeout(() => {
          fetchCoordinates(value);
        }, 1000);

        return {
          ...prevFormData,
          address: value,
          seller: {
            ...prevFormData.seller,
            seller_address: value,
          },
        };
      }

      return {
        ...prevFormData,
        [field]: value,
      };
    });
  };

  const fetchCoordinates = async (address) => {
    if (!address.trim()) {
      Alert.alert("Invalid Address", "The address field is empty. Please enter a valid address.");
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
        setFormData((prevFormData) => ({
          ...prevFormData,
          latitude: lat.toFixed(4),
          longitude: lng.toFixed(4),
        }));
      } else {
        Alert.alert("Address Not Found", "No results found for the entered address. Please check and try again.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      Alert.alert("Error", "Unable to fetch coordinates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onAddPressed = () => {
    if (
      !formData.property_name ||
      !formData.seller?.seller_first_name ||
      !formData.seller?.seller_last_name ||
      !formData.seller?.seller_phone_number ||
      !formData.seller?.seller_address ||
      !formData.seller?.seller_email
    ) {
      Alert.alert("Error", "All fields must be filled.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.seller.seller_email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.seller.seller_phone_number)) {
      Alert.alert("Error", "Invalid phone number. Must be 10-15 digits.");
      return;
    }

    if (
      formData.seller.seller_first_name.length < 2 ||
      formData.seller.seller_last_name.length < 2
    ) {
      Alert.alert("Error", "First and last names must be at least 2 characters.");
      return;
    }

    if (formData.property_name.length < 3) {
      Alert.alert("Error", "Property name must be at least 3 characters.");
      return;
    }

    if (formData.seller.seller_address.length < 5) {
      Alert.alert("Error", "Address must be at least 5 characters.");
      return;
    }

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

    if (onAddProperty) {
      onAddProperty(sanitizedData);
    }
    closeModal(); // Close the modal after submitting
  };

  return (
    <View style={styles.modalContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>

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
          Add Property
        </Button>
      </ScrollView>
    </View>
  );
};
