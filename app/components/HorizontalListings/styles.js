import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  carouselContainer: {
    height: 300,
    overflow: 'hidden', // Ensure no parts of the images overflow the container
  },
  slickContent: {
    paddingHorizontal: 10, // Padding to create space for the next slide to be visible

  },
  cardContainer: {
    marginTop: 20,
    width: '100%', // Set width to 90% to allow partial visibility of the next slide
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center', // Center align each card within Slick
    padding: 15, // Added extra padding for better spacing
  },
  image: {
    width: '100%',
    height: '60%', // Image height is 60% of the card container
    borderRadius: 8,
    resizeMode: 'cover', // Ensure the image is properly covered
  },
  cardTitle: {
    marginTop: 10, // Added more space between the image and the title
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Darker title color for better contrast
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7B61FF',
    marginTop: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  address: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
});

export default styles;
