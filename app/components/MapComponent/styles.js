import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Define breakpoints for responsiveness
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? 10 : isTablet ? 20 : 30,  // More padding for larger screens
  },
  map: {
    width: isMobile ? width * 1 : isTablet ? width * 0.8 : width * 0.7,  // 100% for mobile, 80% for tablet, 70% for desktop
    height: height * (isMobile ? 1.5 : isTablet ? 0.7 : 0.8),  // 150% for mobile, 70% for tablet, 80% for desktop
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: isMobile ? 15 : isTablet ? 25 : 35,  // Padding based on device size
  },
  darkMapStyle: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ],
  lightMapStyle: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#F8F7FF' }], // Very light purple background
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#7B61FF' }], // Theme purple for text
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#FFFFFF' }], // White outline for text contrast
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#E8E6FF' }], // Light purple for roads
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#9C89FF' }], // Medium purple for arterial roads
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#7B61FF' }], // Theme purple for highways
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#7B61FF' }], // Theme purple for road labels
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#F0EDFF' }], // Very light purple for POIs
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#7B61FF' }], // Theme purple for POI labels
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#E6E3FF' }], // Light purple for parks
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#DBD6FF' }], // Light purple tint for water
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#7B61FF' }], // Theme purple for water labels
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#7B61FF', weight: 2 }], // Theme purple, thicker lines for boundaries
    },
    {
      featureType: 'administrative.land_parcel',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative.neighborhood',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#7B61FF' }], // Theme purple for park labels
    },
  ],
  customMapStyle: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#e0f7e9' }], // Light green background
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#546E7A' }], // Dark gray text for labels
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }], // Hide icons for a cleaner look
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }], // White for roads
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8a8a8a' }], // Light gray for road text labels
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#546E7A' }], // Dark gray for POI labels
    },
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }], // Hide POI icons
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#a0e4ff' }], // Light blue for water areas
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }], // Hide transit features
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ visibility: 'off' }], // Hide administrative boundaries
    },
  ],
  customButton: {
    position: 'absolute',
    bottom: isMobile ? 110 : isTablet ? 0 : 0,  // Adjust button position for different screen sizes
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: isMobile ? 8 : isTablet ? 12 : 15,  // More padding for larger screens
    elevation: 5, // Adds shadow on Android
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: isMobile ? 14 : isTablet ? 16 : 18,  // Adjust font size for different screen sizes
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 20, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 64, // Match the height used in AddPropertiesScreen
    borderColor: "#ccc",
    //borderWidth: 1,
    borderRadius: 5,
    marginBottom: '-15',
    paddingLeft: 10,
    //paddingVertical: 10,
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    //gap: 15,

  },
  countInput: {
    // ... existing count input styles ...
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
  },
  closeButtonText: {
    color: "#ff0000",
    fontSize: 16,
  },
  scrollView: {
    padding: 10,
  },
  uploadButton: {
    backgroundColor: '#7B61FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 300,
    height: 175,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  noImageText: {
    color: "#808080",
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 10,
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
  callout: {
    width: 150, // Set a width for the callout
    backgroundColor: 'white', // Background color
    borderRadius: 5, // Rounded corners
    padding: 10, // Padding inside the callout
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow radius
  },
  calloutTitle: {
    fontWeight: 'bold', // Bold title
    fontSize: 16, // Title font size
  },
  calloutDescription: {
    fontSize: 14, // Description font size
    color: 'gray', // Description color
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
    marginTop: 20,
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
    marginBottom: 10,
    marginTop: 10,
  },
});

export default styles;
