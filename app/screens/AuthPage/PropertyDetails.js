import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AnimatedBackground from "../../components/AnimatedBackgroundAlt";
import BackButton from '../../components/BackButton';
import getEnvVars from '../../config/env';
import { useAuth } from '../../context/AuthContext';

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
  const { authState } = useAuth();
  const { property } = route.params; // Get the property details passed via navigation
  const { apiUrl } = getEnvVars();
  const [loading, setLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const propertyId = property.id;
  console.log("Property Object: ", propertyId);

  // State for controlling the modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Get the currency symbol using the getCurrencySymbol function
  const currencySymbol = getCurrencySymbol(property.currency);

  // Get the area unit symbol using the getAreaUnitSymbol function
  const areaUnitSymbol = getAreaUnitSymbol(property.unit);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/properties`);
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to fetch properties');

      const propertyData = data.property.find((property) => property.id === propertyId);

      if (propertyData) {
        setPropertyDetails(propertyData);
      } else {
        console.warn("Property not found");
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propertyId) {
      console.warn("Property ID is missing.");
      return;
    }
  
    fetchPropertyDetails();
  }, [apiUrl, propertyId]);
  
  
  const markAsSold = async (status) => {
    setLoading(true); // Show loading spinner
    try {
      const agentResponse = await fetch(`${apiUrl}/agents`);
      if (!agentResponse.ok) {
        throw new Error("Failed to fetch agents");
      }
      const agentData = await agentResponse.json();

      const matchingAgent = agentData.agents.find((agent) => agent.user_id === authState.user.id);

      if (!matchingAgent) {
        throw new Error("Agent not found for the current user");
      }

      const agentId = matchingAgent.id;

      const response = await fetch(`${apiUrl}/properties/${propertyId}/mark-as-sold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          agent_id: agentId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Property marked as sold!');
        fetchPropertyDetails();
      } else {
        alert(`Failed to mark property as sold: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error marking property as sold:', error);
      alert('Error marking property as sold');
    } finally {
      setLoading(false); // Hide loading spinner
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
      source={{
        uri: propertyDetails?.image_url?.trim() 
          ? propertyDetails?.image_url 
          : 'https://via.placeholder.com/300'
      }} 
      style={styles.image} 
    />
  </View>


  {/* Title and Price Section */}
  <Text style={styles.price}>
    {currencySymbol} {Math.floor(propertyDetails?.price || 0)}
  </Text>

  <Text style={styles.propertyName}>
    {propertyDetails?.property_name || 'Property Name Unavailable'}
  </Text>

  <View style={styles.infoRow}>
    <Icon name="location" size={20} color="#7B61FF" style={styles.icon} />
    <Text style={styles.address}>
      {propertyDetails?.address || 'Address Unavailable'}
    </Text>
  </View>

  <View style={styles.infoRow}>
    <Icon name="checkmark-circle" size={20} color="#7B61FF" style={styles.icon} />
    <Text style={styles.label}>Availability:</Text>
    <Text
      style={[
        styles.status,
        propertyDetails?.status === 'available' ? { color: '#28a745' } :
        propertyDetails?.status === 'sold' ? { color: '#dc3545' } : {},
      ]}
    >
      {propertyDetails?.status || 'Status Unavailable'}
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
          <Text style={styles.detailValue}>{Math.floor(propertyDetails?.area || 0)}</Text>
        </View>
      </View>
      {/* Bedrooms */}
      <View style={styles.detailCard}>
        <Icon name="bed-outline" size={40} color="#7B61FF" />
        <Text style={styles.detailTitle}>Bedroom</Text>
        <Text style={styles.detailValue}>{propertyDetails?.bedrooms || 'N/A'}</Text>
      </View>
      {/* Garage */}
      <View style={styles.detailCard}>
        <Icon name="car-outline" size={40} color="#7B61FF" />
        <Text style={styles.detailTitle}>Garage</Text>
        <Text style={styles.detailValue}>{propertyDetails?.garage || 'N/A'}</Text>
      </View>
      {/* Kitchen */}
      <View style={styles.detailCard}>
        <Icon name="restaurant-outline" size={40} color="#7B61FF" />
        <Text style={styles.detailTitle}>Kitchen</Text>
        <Text style={styles.detailValue}>{propertyDetails?.kitchen || 'N/A'}</Text>
      </View>
      {/* Bathrooms */}
      <View style={styles.detailCard}>
        <Icon name="water-outline" size={40} color="#7B61FF" />
        <Text style={styles.detailTitle}>Bathrooms</Text>
        <Text style={styles.detailValue}>{propertyDetails?.bathrooms || 'N/A'}</Text>
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
          {propertyDetails?.seller && propertyDetails?.seller?.seller_first_name && propertyDetails?.seller?.seller_last_name
            ? `${propertyDetails?.seller?.seller_first_name} ${propertyDetails?.seller?.seller_last_name}`
            : "none"}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Seller Contact #: </Text>
          {propertyDetails?.seller?.seller_phone_number || 'No contact available'}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Property Name: </Text>
          {propertyDetails?.property_name || 'No property name available'}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Address: </Text>
          {propertyDetails?.address || 'No address available'}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Price: </Text>
          {currencySymbol} {Math.floor(propertyDetails?.price || 0)}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Availability: </Text>
          <Text
            style={[
              styles.status,
              propertyDetails?.status === 'available'
                ? { color: '#28a745' }
                : propertyDetails?.status === 'sold'
                ? { color: '#dc3545' }
                : {},
            ]}
          >
            {propertyDetails?.status || 'No status available'}
          </Text>
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Area: </Text>
          {Math.floor(propertyDetails?.area || 0)} {areaUnitSymbol}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Bedrooms: </Text>
          {propertyDetails?.bedrooms || 'N/A'}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Bathrooms: </Text>
          {propertyDetails?.bathrooms || 'N/A'}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Garage: </Text>
          {propertyDetails?.garage || 'N/A'}
        </Text>
        <Text style={styles.modalDetail}>
          <Text style={styles.modalLabel}>Kitchen: </Text>
          {propertyDetails?.kitchen || 'N/A'}
        </Text>
      </ScrollView>

      {/* Mark as Sold Button */}
      <TouchableOpacity
        onPress={() => markAsSold('sold')}
        style={[
          styles.closeButton,
          propertyDetails?.status === 'sold' && styles.disabledButton,
        ]}
        disabled={propertyDetails?.status === 'sold' || loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? 'Processing...'
            : propertyDetails?.status === 'sold'
            ? 'Already Sold'
            : 'Mark as Sold'}
        </Text>
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
    //height: "100%",
  },
  title: {
    fontSize: 20,
    color: "#7B61FF",
    fontWeight: "bold"
  },
  imageContainer: { marginBottom: 16 },
  image: { width: '100%', height: 350, borderRadius: 8 },
  propertyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'flex-start',
    marginBottom: 8,
  },
  infoRow: {
    marginTop: 5
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7B61FF',
    textAlign: 'flex-start',
    marginBottom: 10,
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
    alignItems: 'center',
    height: 240
    //marginTop: 20
  },
  detailCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 150,
    height: 180,
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
