import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  counter: {
    flexDirection: "row", // Stack buttons vertically
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 80, // Ensure consistent width for all counters
    height: 65, // Ensure consistent height for the counter
    backgroundColor: "#fff",
  },
  button: {
    padding: 5,
    width: "100%", // Match button width to counter width
    alignItems: "center",
  },
  value: {
    fontSize: 20,
    fontWeight: "regular",
    textAlign: "center",
    color: "#585858",
  },
});

export default styles;
