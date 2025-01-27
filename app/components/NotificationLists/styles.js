import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ECEAFF', // Light purple background
      padding: 10,
      marginTop: 50,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#2f2f2f',
      marginBottom: 10,
    },
    notificationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    iconContainer: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#4b8bec', // Blue background for icon
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    icon: {
      color: '#fff',
      fontSize: 18,
    },
    textContainer: {
      flex: 1,
      //justifyContent: 'center'
    },
    title: {
      fontSize: 14,
      color: '#2f2f2f',
      //verticalAlign: 'center'
    },
    time: {
      fontSize: 12,
      color: '#888',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      width: '90%',
      borderRadius: 10,
      //alignItems: 'center',
    },
    modalTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 10,
      color: "#7B61FF"
    },
    modalMessage: {
      fontSize: 20,
      whiteSpace: 'nowrap',
      marginBottom: 10,
    },
    modalDeadline: {
      flexDirection: 'column'
    },
    modalDeadlineText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: "#7B61FF",
      marginBottom: 5,
    },
    modalLabel: {
      fontWeight: 'bold', // Make the label bold
    },
    modalDeadlineDetails: {
      flexDirection: 'row',
    },
    modalDeadlineLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2.5
    },
    modalDeadlineValue: {
      flex: 6,
      fontSize: 14,
      fontWeight: 'bold'
    },
    closeButton: {
      width: "100%",
      marginTop: 15,
      padding: 10,
      backgroundColor: '#7B61FF',
      borderRadius: 50,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: "center"
    },
  });
  export default styles;