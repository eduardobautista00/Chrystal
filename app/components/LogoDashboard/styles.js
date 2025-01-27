import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes logo and icon to opposite ends
    paddingHorizontal: 20,
    paddingTop: 50,
    zIndex: 11,
  },
  logoImage: {
    width: "50%",
    height: "100%",
    resizeMode: 'contain',
  },
  profileIcon: {
    padding: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 22.5, // Make it circular
    resizeMode: 'contain',
  },
  });
  

export default styles;