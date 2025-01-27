import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#A9A9A9',
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    // position: "absolute",
    // top: 40,
    // left: 30,
    // zIndex: 20,
    // //paddingTop: 20,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default styles;