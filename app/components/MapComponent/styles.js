import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: width * 1,   // 90% of screen width
    height: height * 1.5, // 70% of screen height
  },
  loadingContainer: {
    flex: 1, // Take up the full screen
    justifyContent: 'center', // Vertically center the indicator
    alignItems: 'center', // Horizontally center the indicator
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Optional: add a translucent background
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
    bottom: 220,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 5, // Adds shadow on Android
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default styles;
