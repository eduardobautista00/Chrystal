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
    bottom: isMobile ? 220 : isTablet ? 200 : 250,  // Adjust button position for different screen sizes
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
});

export default styles;
