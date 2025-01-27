import { StyleSheet } from 'react-native';

import { theme } from "../../core/theme";
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
    
    // flexDirection: 'row', // Align icon and input in a row
    //alignItems: 'center', // Center vertically
  },
  input: {
    backgroundColor: theme.colors.surface,
    width: "100%",
    height: 100,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  label: {
    color: theme.colors.labels,
  },
  error: {
    marginTop: 10,
    marginBottom: -15,
    color: theme.colors.error,
  },
});


export default styles;