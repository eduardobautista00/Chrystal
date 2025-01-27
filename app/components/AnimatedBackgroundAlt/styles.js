import { StyleSheet } from 'react-native';
import { theme } from "../../core/theme";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: "#EDEBF8",
  },
  container: {
    backgroundColor: "#EDEBF8",
    flex: 1,
    width: "100%",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  scrollViewContent: {
    flexGrow: 1, // Ensures that the content takes up the full height
    flexDirection: "column",
    justifyContent: "flex-start", // Center content within the ScrollView
    paddingHorizontal: 20,
    paddingTop: 50,
    height: "100%",
    width: "100%",
  },
});

export default styles;
