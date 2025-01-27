import { StyleSheet } from 'react-native';
import { theme } from '../../core/theme'; // Adjust based on your theme import path

const styles = StyleSheet.create({
  otpInput: {
    width: 50, // Width of each input box
    height: 65, // Height of each input box
    borderWidth: 1, // Border width
    borderColor: theme.colors.secondary, // Border color from your theme
    borderRadius: 8, // Rounded corners
    fontSize: 24, // Font size for the input
    textAlign: 'center', // Center the text
    margin: 5, // Margin around each input box
    backgroundColor: '#FFFFFF', // Background color for the input box
    elevation: 2, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
  },
});

export default styles;
