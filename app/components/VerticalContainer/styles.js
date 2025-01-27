import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height, 
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
    elevation: 11,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewMore: {
    fontSize: 14,
    color: '#0068C8',
  },
  slickWrapper: {
    width: width,
    height: 200, // Adjust to the size of the carousel as needed
    marginTop: 20, // Optional: space between header and slick component
    overflow: 'visible', // Hide content that overflows
  },
  cardContainer: {
    width: width * .75, // Adjust width to accommodate both cards, slightly larger than the screen width
    //marginRight: 10, // Space between the cards
    justifyContent: 'flex-start', // Center the items horizontally
    alignItems: 'center', // Center items vertically
    flexDirection: 'row', // Horizontal layout to show two cards side by side
    overflow: 'visible', // Allow the next card to peek out
  },
  card: {
    width: width * 0.75, // Full card takes up 3/4th of the screen width
    height: height * 0.25,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    //marginRight: 10, // Add spacing between cards
    zIndex: 1, // Ensure the current card is above the next one
  },
  halfCard: {
    width: width * 0.5, // Smaller card takes up 1/4th of the screen width
    height: height * 0.25,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
});

export default styles;
