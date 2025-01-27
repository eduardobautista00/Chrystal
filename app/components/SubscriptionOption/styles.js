import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  planOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc", // Default border color
    backgroundColor: "#fff", // Default background color
    width: "100%",
  },
  selectedOption: {
    borderColor: "#7B61FF", // Border color when selected
    backgroundColor: "#7B61FF1A", // Background color when selected (lighter shade of selected color)
  },
  planText: {
    flex: 1,
    marginLeft: 10, 
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  planDetails: {
    fontSize: 14,
    color: "#555",
  },
  planPrice: {
    fontSize: 16,
    color: "#000",
    marginTop: 5,
  },
  uncheckedColor: {
    color: "#ccc",
  },
  checkedColor: {
    color: "#7B61FF",
  },
});

export default styles;
