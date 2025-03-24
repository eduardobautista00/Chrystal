import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDarkMode } from '../../context/DarkModeContext';
import styles from './styles';

export default function MarkerList({ markers, onMarkerPress, visible, isSearching }) {
  const { isDarkMode } = useDarkMode();

  if (!visible || markers.length === 0) return null;

  const handleMarkerPress = (marker, event) => {
    // Prevent event propagation
    event.stopPropagation();
    onMarkerPress(marker);
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#1A1A1A' }]}>
      <ScrollView style={styles.scrollView}>
        {markers.map((marker, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.markerItem, isDarkMode && { borderColor: '#333' }]}
            onPress={(event) => handleMarkerPress(marker, event)}
          >
            <View style={[styles.colorDot, { backgroundColor: marker.pinColor }]} />
            <View style={styles.markerInfo}>
              <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>
                {marker.title || 'Unnamed Property'}
              </Text>
              <Text style={[styles.description, isDarkMode && { color: '#ccc' }]}>
                {marker.description || 'No address'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}




     