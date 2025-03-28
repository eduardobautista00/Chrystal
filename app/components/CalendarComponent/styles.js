import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1, // Make it take up available space
  },
  scrollViewContentContainer: {
    paddingBottom: 20, // Optional: Add padding at the bottom if needed
  },
  container: {
    flex: 1,
    //paddingTop: 10,
    backgroundColor: '#ECEAFF',
  },
  calendarContainer: {
    backgroundColor: '#ECEAFF', 
    //height: 400, 
    //borderWidth: 1,
  },
  viewSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  viewSwitchButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    //marginVertical: 10,
    textAlign: 'center',
    backgroundColor: '#ECEAFF',
  },
  dayContainer: {
    width: '100%',  // Adjust width to fit your design
    height: 70,  // Adjust height as needed
    paddingTop: 3,  // Remove padding to prevent inner spacing
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -7,
    marginBottom: -15,  // Remove vertical spacing
    marginHorizontal: 0,  // Remove horizontal spacing
    backgroundColor: '#ECEAFF',  // Default background color (transparent)
    borderWidth: 1,  // Optional: border width for clarity
    position: 'relative', // Allow the tag to position properly
  },
  dayText: {
    fontSize: 16,  // Adjust font size
    color: '#000',  // Default text color (black)
  },
  selectedDay: {
    color: '#fff',  // White text for selected day
  },
  disabledDay: {
    backgroundColor: '#f0f0f0', // Grey background for disabled days
  },
  disabledText: {
    color: '#a0a0a0', // Grey text for disabled days
  },
  todayCircle: {
    backgroundColor: '#7B61FF', // Circle color for today
    borderRadius: 50, // Ensure it's a perfect circle
    paddingHorizontal: 8, // Adjust padding for the circle size
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  dayCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  todayText: {
    color: '#fff', // White text for today
    fontWeight: 'bold',
  },
  todoTag: {
    marginTop: 4, // Space between the day number and the tag
    //backgroundColor: '#FFD700', // Yellow background for the tag
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: '90%', // Limit width to prevent overflow
    alignSelf: 'center',
  },
  todoText: {
    fontSize: 10,
    color: '#000', // Text color for the tag
    textAlign: 'center',
    width: '100%',
    maxWidth: 40
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#ddd',
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A0DAD', // Purple color for header text
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  modalTextLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#7B61FF', // Purple background color
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6A0DAD', // Purple background color
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  todoListContainer: {
    //flex: 1, // Allow the list to take remaining space
    paddingVertical: 20,
    maxHeight: 200,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 15,
  },
  actionButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 10,
  },
  disabledDoneButton: {
    backgroundColor: '#008000', // Grey background for disabled buttons
    opacity: 0.5, 
  },
  disabledEditButton: {
    backgroundColor: '#FFA500', // Grey background for disabled buttons
    opacity: 0.5,
  },
  disabledDeleteButton: {
    backgroundColor: '#FF0000', // Grey background for disabled buttons
    opacity: 0.5,
  },
  
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#7B61FF',
    borderWidth: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  mainTabContainer: {
    flexDirection: 'row',
    //marginBottom: 15,
    marginTop: 35,
    borderRadius: 8,
    borderColor: '#7B61FF',
    borderWidth: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginHorizontal: 20,

  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: '#7B61FF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  selectedTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  picker: {
    paddingVertical: 3,
    fontSize: 20,
    //height: 50
  },
  dateHeaderContainer: {
    width: 'auto',
    height: 'auto',

    
    //marginBottom: 10,
  },
  dateContainer: {
    width: 100,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRightWidth: 1,
    //borderLeftWidth: 1,
    //borderBottomWidth: 1,
    alignItems: 'center',
    height: 100,


  },
  todayDayIndicator: {
    backgroundColor: '#7B61FF', // Yellow background to highlight today's date
    color: '#fff',
    borderRadius: 50, // Optional: Adds rounded corners
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dailyCalendarContainer: {
    width: screenWidth,
    borderColor: 'blue',
    //backgroundColor: '#7B61FF',
    justifyContent: 'center',
  },
  dateHeader: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5,
    
  },
  gridContainer: { 
    flexDirection: 'column' 
  },
  gridRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    position: 'relative',
    //borderWidth:1,
    borderRightWidth: 0,
    borderTopWidth: 1,
    //borderBottomWidth: 1,
    //paddingVertical: 10,
    paddingHorizontal: 10
  },
  selectedRow: {
    backgroundColor: '#D3C9FF', // Highlight color for selected row
    borderColor: '#7B61FF', // Optional: Add top border color for better visibility
    borderWidth: 3, // Optional: Add top border width
    borderRadius: 5,
  },
  timeHeaderContainer: {
    borderRightWidth: 1,
    //borderBottomWidth: 5,
    width: 90,
    height: '100%',
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 15,
    paddingHorizontal: 5,

  },
  timeHeader: { 
    fontSize: 14,

    
  },
  todoMarkContainer: {
    //borderWidth: 1,
    //borderBottomWidth: 1,
    //borderTopWidth: 1,
    //marginTop:25,
    height: 100,
    width: '100%'
  },
  todoMark: { 
    fontSize: 14, 
    marginLeft: 10 
  },
  currentTimeMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    width: '85%',
    zIndex: 1, // Ensure it appears above the grid

  },
  currentTimeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#7B61FF',
  },
  currentTimeDot: {
    fontSize: 24,
    color: '#7B61FF',
    fontWeight: 'bold',
    marginRight: '-7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff', // Optional: match your app's theme
},
loadingText: {
  marginTop: 10,
  fontSize: 16,
  color: '#7B61FF',
},
toggleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  //marginBottom: 10,
  height: 30,
},
dropdown: {
  borderColor: '#000',
  borderRadius: 8,
  borderWidth: 0.5,
},
dropdownContainer: {
  borderColor: '#000',
  maxHeight: 200,
  borderRadius: 8,
  borderWidth: 0.5,
},
dropDownContainer: {
  borderColor: '#000',
  maxHeight: 200,
  borderRadius: 8,
  borderWidth: 0.5,
},
searchTextInput: {
  borderColor: '#000',
    borderRadius: 8,
  borderWidth: 0.5,
},
searchContainer: {
  borderBottomColor: '#000',
  borderBottomWidth: 0.5,
},
selectedItemLabel: {
  // Style for selected item labels
  backgroundColor: '#E0E0E0', // Light background for tags
  borderRadius: 20, // Rounded corners
  padding: 5, // Padding for tags
  margin: 2, // Margin between tags
},
placeholderStyle: {
  color: '#00000060',
},
selectedItemContainer: {
  // Style for the container of selected items
  flexDirection: 'row', // Align tags in a row
  flexWrap: 'wrap', // Allow wrapping of tags
},
timeConflictModalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},

timeConflictModalContent: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 20,
  width: '80%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

timeConflictModalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15,
  color: '#333',
},

timeConflictModalMessage: {
  fontSize: 16,
  textAlign: 'center',
  marginBottom: 20,
  color: '#666',
},

timeConflictButtonContainer: {
  width: '100%',
  gap: 10,
},

timeConflictButton: {
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
},

timeConflictPrimaryButton: {
  backgroundColor: '#7B61FF',
},

timeConflictSecondaryButton: {
  backgroundColor: '#7B61FF',
},

timeConflictCancelButton: {
  backgroundColor: 'transparent',
},

timeConflictButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

timeConflictCancelText: {
  color: '#666',
},
timeText: {
  fontSize: 16,
  color: '#000000',
},
});

export default styles;
