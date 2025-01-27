import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.75, // Adjusted height for FeaturedListingWithCarousel
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 20,
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
  carouselContainer: {
    height: 300, // Maintain carousel height for consistency
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    zIndex: 10,
  },
  slickContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    marginTop: 20,
    width: width * 0.9, // Set width to show part of the next slide
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '60%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cardTitle: {
    marginTop: 10,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  // Additions from FeaturedListing
  shadowEffect: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
    elevation: 10,
  },
});

export default styles;
