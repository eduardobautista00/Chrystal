import React from 'react';
import { View, Text, StyleSheet , Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({navigation}) => {
  return (
    <View style={styles.header}>
      
      <Text style={styles.headerText}>Admin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
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