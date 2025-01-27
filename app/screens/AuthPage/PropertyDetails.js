import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AnimatedBackground from "../../components/AnimatedBackgroundAlt";
import BackButton from '../../components/BackButton';
import getEnvVars from '../../config/env';

// Function to map currency codes to their symbols
const getCurrencySymbol = (currencyCode) => {
  switch (currencyCode) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'YEN':
      return '¥';
    default:
      return currencyCode; // Fallback to the code if no symbol is defined
  }
};

// Function to map area units to their symbol representations
const getAreaUnitSymbol = (unit) => {
  switch (unit) {
    case 'ft2':
      return 'ft²'; // Square feet symbol
    case 'km2':
      return 'km²'; // Square meters symbol
    case 'acre':
      return 'ac'; // Acres symbol
    default:
      return unit; // Return the unit as is if no symbol is defined
  }
};

const PropertyDetails = ({ route, navigation }) => {
  const { property } = route.params; // Get the property details passed via navigation
  const { apiUrl } = getEnvVars();
  console.log("Property Object: ", property);

  // State for controlling the modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Get the currency symbol using the getCurrencySymbol function
  const currencySymbol = getCurrencySymbol(property.currency);

  // Get the area unit symbol using the getAreaUnitSymbol function
  const areaUnitSymbol = getAreaUnitSymbol(property.unit);

  // Function to get the seller name or "none" if there are no sellers
  const getSellerName = () => {
    if (property.sellers && property.sellers.length > 0) {
      return property.sellers[0].name;
    } else {
      return "none"; // Return "none" if no seller is available
    }
  };

  const markAsSold = async () => {
    try {
      const response = await fetch(`${apiUrl}/properties/${property.id}/mark-as-sold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Property marked as sold!');
        // Handle success, maybe update the state or close the modal
      } else {
        alert('Failed to mark property as sold');
      }
    } catch (error) {
      console.error('Error marking property as sold:', error);
      alert('Error marking property as sold');
    }
  };
  

  return (
    <AnimatedBackground>
      <View style={styles.backButtoncontainer}>
        <BackButton goBack={navigation.goBack} />
        <Text style={styles.title}>Property Details</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="ellipsis-vertical" size={24} color="#000" style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: property.image_url && property.image_url.trim() !== '' ? property.image_url : 'https://via.placeholder.com/300' }} 
            style={styles.image} 
          />
        </View>

        {/* Title and Price Section */}
        <Text style={styles.price}>
          {currencySymbol} {Math.floor(property.price)}
        </Text>

        <Text style={styles.propertyName}>{property.property_name}</Text>

        <View style={styles.infoRow}>
          <Icon name="location" size={20} color="#7B61FF" style={styles.icon} />
          <Text style={styles.address}>{property.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="checkmark-circle" size={20} color="#7B61FF" style={styles.icon} />
          <Text style={styles.label}>Availability:</Text>
          <Text
            style={[
              styles.status,
              property.status === 'available' ? { color: '#28a745' } : property.status === 'sold' ? { color: '#dc3545' } : {},
            ]}
          >
            {property.status}
          </Text>
        </View>


        {/* Property Details Section */}
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.detailsRow}>
            {/* Area */}
            <View style={styles.detailCard}>
              <Icon name="resize-outline" size={40} color="#7B61FF" />
              <Text style={styles.detailTitle}>Area</Text>
              <View style={styles.area}>
                <Text style={styles.detailValue}>{Math.floor(property.area)}</Text>
              </View>
            </View>
            {/* Bedrooms */}
            <View style={styles.detailCard}>
              <Icon name="bed-outline" size={40} color="#7B61FF" />
              <Text style={styles.detailTitle}>Bedroom</Text>
              <Text style={styles.detailValue}>{property.bedrooms}</Text>
            </View>
            {/* Garage */}
            <View style={styles.detailCard}>
              <Icon name="car-outline" size={40} color="#7B61FF" />
              <Text style={styles.detailTitle}>Garage</Text>
              <Text style={styles.detailValue}>{property.garage}</Text>
            </View>
            {/* Kitchen */}
            <View style={styles.detailCard}>
              <Icon name="restaurant-outline" size={40} color="#7B61FF" />
              <Text style={styles.detailTitle}>Kitchen</Text>
              <Text style={styles.detailValue}>{property.kitchen}</Text>
            </View>
            {/* Bathrooms */}
            <View style={styles.detailCard}>
              <Icon name="water-outline" size={40} color="#7B61FF" />
              <Text style={styles.detailTitle}>Bathrooms</Text>
              <Text style={styles.detailValue}>{property.bathrooms}</Text>
            </View>
          </View>
        </ScrollView>

      </View>

      {/* Modal for complete property details */}
      <Modal
  visible={modalVisible}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
  transparent={true}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Complete Property Details</Text>
      <ScrollView style={styles.modalDetails}>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Property Seller: </Text>
          {property.seller ? `${property.seller.seller_first_name} ${property.seller.seller_last_name}` : "No seller available"}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Seller Contact #: </Text>{property.seller.seller_phone_number}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Property Name: </Text>{property.property_name}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Address: </Text>{property.address}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Price: </Text>{currencySymbol} {Math.floor(property.price)}
        </Text>
        <Text style={styles.modalDetail}>
        <Text style={styles.modalLabel}>Availability: </Text>
        <Text
          style={[
            styles.status,
            property.status === 'available' ? { color: '#28a745' } : property.status === 'sold' ? { color: '#dc3545' } : {},
          ]}
        >
          {property.status}
        </Text>
      </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Area: </Text>{Math.floor(property.area)} {areaUnitSymbol}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Bedrooms: </Text>{property.bedrooms}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Bathrooms: </Text>{property.bathrooms}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Garage: </Text>{property.garage}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Kitchen: </Text>{property.kitchen}
        </Text>
      </ScrollView>

      {/* Mark as Sold Button */}
      <TouchableOpacity
        onPress={markAsSold}
        style={[styles.closeButton, property.status === 'sold' && styles.disabledButton]}
        disabled={property.status === 'sold'}
      >
        <Text style={styles.buttonText}>Mark as Sold</Text>
      </TouchableOpacity>


      {/* Close Button */}
      <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "90%",
  },
  title: {
    fontSize: 20,
    color: "#7B61FF",
    fontWeight: "bold"
  },
  imageContainer: { marginBottom: 16 },
  image: { width: '100%', height: 300, borderRadius: 8 },
  propertyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'flex-start',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B61FF',
    textAlign: 'flex-start',
    marginBottom: 20,
    width: "100%",
  },
  status: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 120,
    height: 150,
    marginHorizontal: 8,
  },
  detailTitle: { fontSize: 18, color: '#555', marginTop: 4, fontWeight: "bold"},
  detailValue: { marginTop: 4, fontSize: 25, fontWeight: 'bold', color: '#7B61FF' },
  backButtoncontainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#7B61FF"
  },
  modalDetails: {
    width: '100%',
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  modalLabel: {
    fontWeight: 'bold', // Make the label bold
  },
  closeButton: {
    width: "100%",
    marginTop: 15,
    padding: 10,
    backgroundColor: '#7B61FF',
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: "center"
  },
  disabledButton: {
    opacity: 0.5, // Reduce opacity for a disabled look
  },
});

export default PropertyDetails;
