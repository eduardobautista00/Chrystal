import { StyleSheet } from 'react-native';

import { theme } from "../../core/theme";
const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 15,    
    // flexDirection: 'row', // Align icon and input in a row
    // alignItems: 'center', // Center vertically
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    height: 64,


},
countryCodePicker: {
  flex: 0.35, // 30% width
  paddingHorizontal: 5,
  height: 63,
  justifyContent: 'center',
},
phoneNumberContainer: {
  flex: 0.7, // 70% width
  
  
},
phoneNumberInput: {
  textAlignVertical: 'center',
  height: 63,
  marginTop: -6,
  
},
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 0,
  },
  label: {
    color: theme.colors.labels,
  },
  errorBorder: {
    borderColor: theme.colors.error,
},
errorText: {
    //marginVertical: 10,
    color: theme.colors.error,
    //justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 65,
    
},
});


export default styles;