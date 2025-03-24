import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: "Bold",
    color: "#7B61FF",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 15,
    color: "#555",
  },
  input: {
    marginBottom: -20,
    height: 64,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#aaa",
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  addButton: {
    marginTop: 10,
  },
  backButtoncontainer: {
    paddingTop: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default styles;