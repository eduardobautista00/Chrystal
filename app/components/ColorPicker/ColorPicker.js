import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const colors = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#000000', // Black
  '#FFFFFF', // White
];

const ColorPicker = ({ color, onColorChange }) => {
  return (
    <View style={styles.container}>
      {colors.map((c) => (
        <TouchableOpacity
          key={c}
          style={[styles.colorBox, { backgroundColor: c, borderWidth: color === c ? 3 : 0 }]}
          onPress={() => onColorChange(c)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorBox: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 5,
  },
});

export default ColorPicker; 