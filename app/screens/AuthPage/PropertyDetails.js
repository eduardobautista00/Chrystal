import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AnimatedBackground from "../../components/AnimatedBackgroundAlt";
import BackButton from '../../components/BackButton';
import getEnvVars from '../../config/env';
import { useAuth } from '../../context/AuthContext';
import DropDownPicker from 'react-native-dropdown-picker';
import CountInput from '../../components/CountInput';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import TextInput from "../../components/TextInput";

// Function to map currency codes to their symbols
const getCurrencySymbol = (currencyCode) => {
  switch (currencyCode.toUpperCase()) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'JPY':
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
    case 'm2':
      return 'm²'; // Square meters symbol
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
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [openBuyer, setOpenBuyer] = useState(false);
  const [buyerItems, setBuyerItems] = useState([]);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState('existing');
  const [buyerFirstName, setBuyerFirstName] = useState('');
  const [buyerLastName, setBuyerLastName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [createNewBuyer, setCreateNewBuyer] = useState(false);

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
    fetchBuyers();
  }, [apiUrl, propertyId]);
  
  
  const fetchBuyers = async () => {
    try {
      const response = await fetch(`${apiUrl}/buyers/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch buyers');
      const data = await response.json();
      
      // Format buyers for the dropdown using the correct property names
      const formattedBuyers = (data || []).map(buyer => ({
        label: `${buyer.buyer_first_name} ${buyer.buyer_last_name}`,
        value: buyer.id,
        buyer: buyer // Store the full buyer object for reference
      }));
      
      setBuyerItems(formattedBuyers);
    } catch (error) {
      console.error('Error fetching buyers:', error);
      alert('Error fetching buyers');
    }
  };

  

  const markPropertyAsSold = async (status, buyerId, isNewBuyer) => {
    try {
      const agentResponse = await fetch(`${apiUrl}/agents`);
      if (!agentResponse.ok) throw new Error("Failed to fetch agents");
      const agentData = await agentResponse.json();

      const matchingAgent = agentData.agents.find((agent) => agent.user_id === authState.user.id);
      if (!matchingAgent) throw new Error("Agent not found for the current user");

      const requestBody = {
        property_id: propertyId,
        buyer_id: buyerId,
        agent_id: matchingAgent.id,
        status: status,
        create_new_buyer: isNewBuyer
      };

      // Only add buyer details if creating a new buyer
      if (isNewBuyer) {
        Object.assign(requestBody, {
          buyer_first_name: buyerFirstName,
          buyer_last_name: buyerLastName,
          email: buyerEmail,
          buyer_phone_number: buyerPhone,
          buyer_address: buyerAddress
        });
      }

      const response = await fetch(`${apiUrl}/properties/${propertyId}/mark-as-sold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark property as sold');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking property as sold:', error);
      throw error;
    }
  };

  const handleCreateBuyerAndMarkAsSold = async () => {
    if (!buyerFirstName || !buyerLastName || !buyerEmail || !buyerPhone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await markPropertyAsSold('sold', null, true);
      
      alert('Property marked as sold!');
      setShowBuyerModal(false);
      fetchPropertyDetails();
      
      // Reset form fields
      setBuyerFirstName('');
      setBuyerLastName('');
      setBuyerEmail('');
      setBuyerPhone('');
      setBuyerAddress('');
      setSelectedBuyer(null);
      
    } catch (error) {
      Alert.alert('Failed to create buyer', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Also add a useEffect to track state changes
  useEffect(() => {
    console.log('createNewBuyer state changed to:', createNewBuyer);
  }, [createNewBuyer]);

  const handleExistingBuyerSubmit = async () => {
    if (!selectedBuyer) {
      Alert.alert('Error', 'Please select a buyer');
      return;
    }

    setLoading(true);
    try {
      const response = await markPropertyAsSold('sold', selectedBuyer, false);
      
      if (response.success) {
        Alert.alert('Sold', 'Property marked as sold!');
        setShowBuyerModal(false);
        fetchPropertyDetails(); // Refresh property details
        setSelectedBuyer(null);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to mark property as sold');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProperty = async () => {
    try {
      const currentProperty = property;
      setLoading(true);

      // Create FormData instance
      const formData = new FormData();
      
      // Add _method field for PUT request
      formData.append("_method", "PUT");

      // Prepare property data with explicit string conversions
      const propertyData = {
        property_name: propertyDetails?.property_name || currentProperty.property_name,
        property_type: propertyDetails?.property_type || currentProperty.property_type,
        address: propertyDetails?.address || currentProperty.address,
        price: (propertyDetails?.price || currentProperty.price).toString(),
        area: (propertyDetails?.area || currentProperty.area).toString(),
        bedrooms: (propertyDetails?.bedrooms || currentProperty.bedrooms).toString(),
        bathrooms: (propertyDetails?.bathrooms || currentProperty.bathrooms).toString(),
        kitchen: (propertyDetails?.kitchen || currentProperty.kitchen).toString(),
        garage: (propertyDetails?.garage || currentProperty.garage).toString(),
        latitude: (propertyDetails?.latitude || currentProperty.latitude).toString(),
        longitude: (propertyDetails?.longitude || currentProperty.longitude).toString(),
        currency: propertyDetails?.currency || currentProperty.currency || 'USD',
        unit: propertyDetails?.unit || currentProperty.unit || 'm2',
        pin_color: propertyDetails?.pin_color || currentProperty.pin_color || '#7B61FF',
        status: propertyDetails?.status || currentProperty.status,
        seller_id: currentProperty.seller_id.toString()
      };

      // Append all property data to FormData
      Object.entries(propertyData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // If there's a new image, append it
      if (propertyDetails?.newImage) {
        formData.append('image_url', {
          uri: propertyDetails.newImage.uri,
          type: 'image/jpeg',
          name: 'property_image.jpg'
        });
      }

      const response = await axios.post(
        `${apiUrl}/properties/${propertyId}`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000
        }
      );

      console.log('Response:', response.data);

      if (response.data?.message === 'Property updated successfully') {
        Alert.alert('Success', response.data.message);
        setEditModalVisible(false);
        await fetchPropertyDetails();
        return;
      }

      throw new Error(response.data?.message || 'Failed to update property');

    } catch (error) {
      console.error('Error updating property:', error);
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages[0]}`)
          .join('\n');
        Alert.alert('Validation Error', errorMessages);
      } else if (!error.message.includes('Property updated successfully')) {
        Alert.alert('Error', error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPropertyDetails(prev => ({
          ...prev,
          image_url: result.assets[0].uri,
          newImage: result.assets[0]
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B61FF" />
          <Text style={styles.loadingText}>Loading property details...</Text>
        </View>
      ) : (
        <View style={styles.container}>

  {/* Image Section */}
  <View style={styles.imageContainer}>
    <Image 
      source={{
        uri: propertyDetails?.image_url?.trim() 
          ? propertyDetails?.image_url 
          : 'https://dummyimage.com/300x300'
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
      )}


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

      {/* Add this new Modal for buyer selection */}
      <Modal
        visible={showBuyerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBuyerModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: 'auto' }]}>
            <Text style={styles.modalTitle}>Select or Add Buyer</Text>

            {/* Tab Container */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, modalTab === 'existing' && styles.selectedTab]}
                onPress={() => {
                  setModalTab('existing');
                  setCreateNewBuyer(false);
                  console.log('Switched to Existing Buyer Tab - createNewBuyer:', false);
                }}
              >
                <Text style={[styles.tabText, modalTab === 'existing' && styles.selectedTabText]}>
                  Existing Buyer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, modalTab === 'new' && styles.selectedTab]}
                onPress={() => {
                  setModalTab('new');
                  setCreateNewBuyer(true);
                  console.log('Switched to New Buyer Tab - createNewBuyer:', true);
                }}
              >
                <Text style={[styles.tabText, modalTab === 'new' && styles.selectedTabText]}>
                  New Buyer
                </Text>
              </TouchableOpacity>
            </View>

            {modalTab === 'existing' ? (
              // Existing Buyer Content
              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  open={openBuyer}
                  value={selectedBuyer}
                  items={buyerItems}
                  setOpen={setOpenBuyer}
                  setValue={setSelectedBuyer}
                  setItems={setBuyerItems}
                  placeholder="Select a buyer"
                  searchable={true}
                  searchPlaceholder="Search buyers..."
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropDownContainer}
                  searchTextInputStyle={styles.searchTextInput}
                  searchContainerStyle={styles.searchContainer}
                />
              </View>
            ) : (
              // New Buyer Form Content
              <ScrollView style={styles.formContainer}>
                <TextInput
                  label="First Name"
                  value={buyerFirstName}
                  onChangeText={setBuyerFirstName}
                  style={styles.input}
                />
                <TextInput
                  label="Last Name"
                  value={buyerLastName}
                  onChangeText={setBuyerLastName}
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  value={buyerEmail}
                  onChangeText={setBuyerEmail}
                  style={styles.input}
                  keyboardType="email-address"
                />
                <TextInput
                  label="Phone Number"
                  value={buyerPhone}
                  onChangeText={setBuyerPhone}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
                <TextInput
                  label="Address"
                  value={buyerAddress}
                  onChangeText={setBuyerAddress}
                  style={styles.input}
                />
              </ScrollView>
            )}

            <TouchableOpacity
              style={[
                styles.closeButton,
                (!selectedBuyer && modalTab === 'existing') && styles.disabledButton,
                (modalTab === 'new' && (!buyerFirstName || !buyerLastName || !buyerEmail || !buyerPhone)) && styles.disabledButton
              ]}
              onPress={() => {
                if (modalTab === 'existing') {
                  handleExistingBuyerSubmit();
                } else {
                  handleCreateBuyerAndMarkAsSold();
                }
              }}
              disabled={(modalTab === 'existing' && !selectedBuyer) || 
                       (modalTab === 'new' && (!buyerFirstName || !buyerLastName || !buyerEmail || !buyerPhone)) || 
                       loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Mark as Sold'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowBuyerModal(false);
                setSelectedBuyer(null);
                setOpenBuyer(false);
                setBuyerFirstName('');
                setBuyerLastName('');
                setBuyerEmail('');
                setBuyerPhone('');
                setBuyerAddress('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modify the existing "Mark as Sold" button in your modal */}
      <TouchableOpacity
        onPress={() => setShowBuyerModal(true)}
        style={[
          styles.closeButton,
          propertyDetails?.status === 'sold' && styles.disabledButton,
        ]}
        disabled={propertyDetails?.status === 'sold'}
      >
        <Text style={styles.buttonText}>
          {propertyDetails?.status === 'sold' ? 'Already Sold' : 'Mark as Sold'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setEditModalVisible(true);
          setModalVisible(false);
        }}
        style={[
          styles.closeButton,
          propertyDetails?.status === 'sold' && styles.disabledButton,
        ]}
        disabled={propertyDetails?.status === 'sold'}
      >
        <Text style={styles.buttonText}>
          Edit Property
        </Text>
      </TouchableOpacity>

      {/* Close Button */}
      <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

<Modal
  visible={editModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setEditModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Property Details</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.modalDetails}>
        {/* Image Preview */}
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{
              uri: propertyDetails?.newImage?.uri || propertyDetails?.image_url || 'https://dummyimage.com/300x300'
            }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage}
        >
          <Icon name="camera-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Change Image</Text>
        </TouchableOpacity>

        <TextInput
          label="Property Name"
          value={propertyDetails?.property_name}
          onChangeText={(text) => setPropertyDetails(prev => ({
            ...prev,
            property_name: text
          }))}
          style={[styles.input]}
        />
        
        {/*<Text style={styles.inputLabel}>Address</Text>*/}
        <TextInput
          label="Address"
          value={propertyDetails?.address}
          onChangeText={(text) => setPropertyDetails(prev => ({
            ...prev,
            address: text
          }))}
          style={[styles.input]}
        />

        {/*<Text style={styles.inputLabel}>Price ({currencySymbol})</Text>*/}
        <TextInput
          label={`Price (${currencySymbol})`}
          value={propertyDetails?.price?.toString()}
          onChangeText={(text) => setPropertyDetails(prev => ({
            ...prev,
            price: text
          }))}
          keyboardType="numeric"
          style={[styles.input, { height: 64 }]}
        />

        {/*<Text style={styles.inputLabel}>Area ({areaUnitSymbol})</Text>*/}
        <TextInput
          label={`Area (${areaUnitSymbol})`}
          value={propertyDetails?.area?.toString()}
          onChangeText={(text) => setPropertyDetails(prev => ({
            ...prev,
            area: text
          }))}
          keyboardType="numeric"
          style={[styles.input]}
        />

        <Text style={[styles.modalTitle, { marginTop: 20 }]}>Property Features</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.countRowContainer}
        >
          <View style={styles.countRow}>
            <CountInput
              label="Bedrooms"
              value={propertyDetails?.bedrooms}
              onValueChange={(value) => setPropertyDetails(prev => ({
                ...prev,
                bedrooms: value
              }))}
            />
            <CountInput
              label="Bathrooms"
              value={propertyDetails?.bathrooms}
              onValueChange={(value) => setPropertyDetails(prev => ({
                ...prev,
                bathrooms: value
              }))}
            />
            <CountInput
              label="Kitchen"
              value={propertyDetails?.kitchen}
              onValueChange={(value) => setPropertyDetails(prev => ({
                ...prev,
                kitchen: value
              }))}
            />
            <CountInput
              label="Garage"
              value={propertyDetails?.garage}
              onValueChange={(value) => setPropertyDetails(prev => ({
                ...prev,
                garage: value
              }))}
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleUpdateProperty}
        >
          <Text style={styles.buttonText}>Update Property</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setEditModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
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
    width: '90%',
    maxHeight: '80%',
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
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dropDownContainer: {
    borderColor: '#ddd',
    maxHeight: 200,
  },
  searchTextInput: {
    borderColor: '#ddd',
    borderRadius: 8,
  },
  searchContainer: {
    borderBottomColor: '#ddd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7B61FF',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 64, // Match the height used in AddPropertiesScreen
    borderColor: "#ccc",
    //borderWidth: 1,
    borderRadius: 5,
    marginBottom: '-10',
    paddingLeft: 10,
    //paddingVertical: 10,
  },
  countRowContainer: {
    marginBottom: 20,
  },
  countRow: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 10,
  },
  uploadButton: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#7B61FF',
    borderRadius: 50,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#7B61FF',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedTab: {
    backgroundColor: '#7B61FF',
  },
  tabText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: '#fff',
  },
  formContainer: {
    maxHeight: 300,
    width: '100%',
  },
});

export default PropertyDetails;
