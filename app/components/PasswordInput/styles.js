import { StyleSheet } from 'react-native';

import { theme } from "../../core/theme";
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
    // flexDirection: 'row', // Align icon and input in a row
    // alignItems: 'center', // Center vertically
  },
  input: {
    backgroundColor: theme.colors.surface,
    width: "100%",
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  icon: {
    color: "#3C3C4399",
    fontSize: 25,
  },
  label: {
    color: theme.colors.labels,
  },
  error: {
    color: theme.colors.error,
  },
});


export default styles;