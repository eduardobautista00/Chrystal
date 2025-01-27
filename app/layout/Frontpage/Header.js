import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;