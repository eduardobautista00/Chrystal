import { StyleSheet } from 'react-native';

import { theme } from "../../core/theme";
const styles = StyleSheet.create({
  container: {
    width: "100%",
    //marginVertical: 12,
    marginTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '-5',
  },
  pickerContainer: {
    flex: 1,
    height: 64,
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  picker: {
    height: '100%',
    width: '100%',
  },
  inputContainer: {
    //width: '55%',
    flex: 1.5,
    height: 64,
    marginBottom: 15,
  },
  input: {
    height: 64,
  },
  errorBorder: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    paddingTop: 4,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 0,
  },
  label: {
    color: theme.colors.labels,
  },
});

export default styles;