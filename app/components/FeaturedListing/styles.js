import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sheetContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  carouselContainer: {
    //paddingVertical: 10,
    height: 250,

  },
  cardContainer: {
    width: width * 1,
    //height: '100%',
    justifyContent: 'center', // Align items in the center if necessary
    //alignItems: 'center',
    //marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#7B61FF',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
  showButton: {
    position: 'absolute',
    bottom: 50,  // Adjusted to give some spacing from the bottom
    right: 20,   // Right positioning
    backgroundColor: '#fff',  // Custom background color
    borderRadius: 30,  // Half of width/height to make it a circle
    width: 45,    // Fixed width
    height: 45,   // Fixed height to make it a circle
    justifyContent: 'center',  // Center the content inside the circle
    alignItems: 'center',  // Center the content horizontally and vertically
    elevation: 5,  // Shadow for elevation
  },
  
  showText: {
    color: '#fff',
  },
});

export default styles;
