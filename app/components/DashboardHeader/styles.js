import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    headerContainer: {
      paddingVertical: 10,
      backgroundColor: 'transparent',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#7b5ad9',
      textAlign: 'center',
      marginBottom: 5,
    },
    logo: {
      width: 200,
      height: 50,
    },
    searchAndProfile: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      marginBottom: 10,
    },
  });

export default styles;