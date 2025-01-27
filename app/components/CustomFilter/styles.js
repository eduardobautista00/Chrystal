import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1.5,
    backgroundColor: '#f0f0f0',
    height: 200,
  },

  // Title text
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // Filter container
  filterContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  // Modal Headel
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
    backgroundColor: '#ED1C24',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 'All' filter button
  allFilter: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    marginRight: 10,
  },
  allText: {
    color: '#fff',
  },

  // Individual filter button
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 5,
  },

  // 'Add filter' button
  addFilter: {
    padding: 10,
  },
  addFilterText: {
    color: '#333',
    fontSize: 16,
  },

  // Edit and delete buttons
  editButton: {
    marginLeft: 5,
  },
  editText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 5,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
  },

  // Modal styling
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },

  // Color picker styling
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorPickerText: {
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
  },
  colorCircle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  characterCounterContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  characterCounterText: {
    fontSize: 12,
    color: '#888',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
});

export default styles;
