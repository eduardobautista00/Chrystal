import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 0,
    //marginTop: -20,
  },
  navButton: {
    padding: 10,
    borderRadius: 50,
    //borderRightWidth: 0.01,
    //borderLeftWidth: 0.01,
    //borderBottomWidth: 5,
    //borderTopWidth: 0,
    //borderColor: '#7B61FF',
  },
});

export default styles;
