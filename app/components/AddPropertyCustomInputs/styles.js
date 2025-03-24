import { StyleSheet } from 'react-native';
import { theme } from "../../core/theme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //marginBottom: 20,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Space inputs evenly
    alignItems: "center",
    marginBottom: 15, // Increased spacing between rows for better readability
  },
  rowPrice: {
    flexDirection: "row",
    justifyContent: "space-between", // Space inputs evenly
    alignItems: "center",
    marginBottom: 15, // Increased spacing between rows for better readability
  },
  halfWidth: {
    width: "49%", // Ensure half the width for latitude and longitude inputs
    height: 64,
    marginTop: -3,
  },
  fourthWidth: {
    width: "60%", // Ensure half the width for latitude and longitude inputs
    height: 64,
    marginTop: -10,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 64, // Match input height for consistency
    width: "100%", // Full width for price and area rows
    paddingHorizontal: 8, // Add padding inside the container for spacing
    backgroundColor: "#fff", // Ensure picker and input have a uniform background
  },
   borderedPicker: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 4,
    paddingLeft: 10, // Adjust to bring the text closer to the left
    marginRight: 5, // Adjust right margin if needed
    //height: 64,
    justifyContent: "center",
    alignItems: "center",

  },
  picker: {
    width: '100%',
    height: 64,
    paddingRight: 10,    // Bring the dropdown arrow closer by adjusting right padding
    marginBottom: 0,     // Remove or reduce the margin
    
  },
  textInput: {
    flex: 1, // Allow text input to take up remaining space in the container
    backgroundColor: "#FFFFFF", // Remove background color for seamless design
  },
  description: {
    fontSize: 12,
    color: "#808080",
    marginTop: 5,
  },
  error: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 5,
  },
  disabledInput: {
    backgroundColor: "#e0e0e0", // Darker gray background
    color: "#8a8a8a", // Medium gray text
    borderColor: "#c0c0c0", // Medium gray border
    height: 64,
}

});

export default styles;
