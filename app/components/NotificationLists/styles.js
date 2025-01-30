import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ECEAFF', // Light purple background
      padding: 10,
      marginTop: 30,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2f2f2f',
      marginBottom: 10,
      marginLeft: 10
    },
    notificationContainer: {
      flexDirection: 'row',
      padding: 20,
      borderRadius: 8,
      marginVertical: 5,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
  
    iconContainer: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'transparent', // Blue background for icon
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    icon: {
      color: '#fff',
      fontSize: 16,
    },
    unreadIcon: {
      color: '#4CAF50', // Green for unread icon
    },
    readIcon: {
      color: '#D3D3D3', // Light gray for read icon
    },  
    textContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: 14,
      color: '#2f2f2f',
    },
    timeAgo: {
      fontSize: 10, // Reduce the font size slightly
      color: '#888',
      fontStyle: 'italic',
      position: 'relative',
      top: 15, // Move the text slightly downward
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
      //flex: 1,
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
    readNotification: {
      backgroundColor: '#B0B0B0', // Light gray for read notifications
    },
    unreadNotification: {
      backgroundColor: '#fff', // White background for unread notifications
      borderLeftColor: '#7B61FF', // Purple border for unread notifications
      borderLeftWidth: 5,
      elevation: 10, // More elevation for unread to stand out
    },
    readTimeAgo: {
      color: '#fff', // White for read (consistent with dark background)
      //fontStyle: 'italic'
    },
    unreadTimeAgo: {
      color: '#000', // Black for unread
    },
  });
  export default styles;