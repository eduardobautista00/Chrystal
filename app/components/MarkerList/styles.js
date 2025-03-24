import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      maxHeight: 200,
      backgroundColor: '#fff',
      borderRadius: 8,
      margin: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 9,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 40,
    },
    scrollView: {
      padding: 10,
    },
    markerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 10,
    },
    markerInfo: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
    },
    description: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
    },
  });

  export default styles;