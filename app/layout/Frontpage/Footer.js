import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2023 My App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 50,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderTopColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#000',
    fontSize: 14,
  },
});

export default Footer;