import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  propertyListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  propertyListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyListHeadertext: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  propertyImage: {
    width: 185,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7B61FF',
    marginBottom: 5,
  },
  propertyTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'semibold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyAddress: {
    fontSize: 14,
    color: '#585858',
  },
  addressIcon: {
    marginRight: 4, // Space between the icon and the text
  },
  ListContainer: { 
    height: 350, 
    overflow: 'hidden', 
  },
  noPropertiesContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPropertiesText: {
    fontSize: 16,
    color: '#7B61FF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default styles;
