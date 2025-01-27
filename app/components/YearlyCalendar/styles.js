import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#ECEAFF',
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ECEAFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7B61FF'
  },
  monthsContainer: {
    flexDirection: 'column', // Arrange items vertically
    backgroundColor: '#ECEAFF',
    marginBottom: 75,

  },
  monthContainer: {
    width: '100%', // Occupy full width of the parent container
    backgroundColor: '#ECEAFF',
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingBottom: 10,
    //padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  calendarStyle: {
    borderRadius: 8,
  },
  dayContainer: {
    width: 55,  // Adjust width to fit your design
    height: 65,  // Adjust height as needed
    paddingTop: 3,  // Remove padding to prevent inner spacing
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -7,
    marginBottom: -15,  // Remove vertical spacing
    marginHorizontal: 3,  // Remove horizontal spacing
    backgroundColor: '#ECEAFF',  // Default background color (transparent)
    borderWidth: 1,  // Optional: border width for clarity
    borderColor: '#ddd',  // Optional: light border color for day cells
    position: 'relative', // Allow the tag to position properly
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
  dayText: {
    fontSize: 16,  // Adjust font size
    color: '#000',  // Default text color (black)
  },
  });

  export default styles;