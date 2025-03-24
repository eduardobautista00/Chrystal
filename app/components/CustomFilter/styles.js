import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    //height: 200,
    paddingHorizontal: 20,
    paddingVertical: 10
    flex: 1,
    backgroundColor: 'transparent',
    //height: 200,
    paddingHorizontal: 20,
    paddingVertical: 10
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
    backgroundColor: '#7B61FF',
    backgroundColor: '#7B61FF',
    borderRadius: 20,
    width: 30,
    height: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
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
    color: '#000',
    color: '#000',
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
    //padding: 20,
    backgroundColor: '#fff',
  },
  modalContent: {
    //flex: 1,
    justifyContent: 'flex-start',
    //padding: 20,
    backgroundColor: '#fff',
  },
  modalContent: {
    //flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
    //height: '100%',
  },
  modalTitleHeader: {
    fontSize: 26,
    color: '#000',
    marginBottom: 10,
    //height: '100%',
  },
  modalTitleHeader: {
    fontSize: 26,
    color: '#000',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontSize: 24,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    //marginBottom: 10,
  },
  filterOptionTitle: {
    fontSize: 20,
    color: '#000',
    //marginBottom: 10,
  },

  // Color picker styling
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    justifyContent: 'space-between',
  },
  colorPickerText: {
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
  },
  colorCircle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 35,
    height: 35,
    width: 35,
    height: 35,
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
    backgroundColor: '#7B61FF',
    backgroundColor: '#7B61FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '95%',
    marginTop: 10,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,

    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,

  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    borderWidth: 1,
  },
  rangeTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  rangeTitleText: {
    fontSize: 16,
    color: '#888',
  },
  rangeText: {
    fontSize: 16,
    color: '#888',
  },
  filterOptionSection: {
    marginTop: 10,
  },
  // Checkbox container
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#7B61FF', // Border color
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'transparent', // Default background
  },
  checkedCheckbox: {
    backgroundColor: '#7B61FF', // Change to your desired checked color
  },

  checkboxText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold', // Make text bold
  },

  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picker: {
    //width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    paddingVertical: 5,
    borderRadius: 5,
  },
  typeGridContainer: {
    width: '100%',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  typeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default styles;
