import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    top: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10, // Add a high zIndex to place it above other components
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 8,
  },
  filterButton: {
    marginLeft: 8,
  },
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10, // Space between the search field and filter tags
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFilterTag: {
    backgroundColor: '#7B61FF', // Change background color for the selected filter
  },
  filterTagText: {
    color: '#333',
  },
  selectedFilterTagText: {
    color: '#fff', // Change text color for the selected filter
  },
  removeIcon: {
    marginLeft: 5,
  },
});

export default styles;
