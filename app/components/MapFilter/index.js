import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function MapFilter({ filters = [], onFilterPress }) {
  return (
    <View style={styles.filterContainer}>
      {filters.length > 0 ? ( // Check if filters exist and have elements
        filters.map((filter, index) => {
          // Log each filter to check its type
          console.log('Filter:', filter);

          // Ensure filter is a string or can be rendered as a string
          const filterText = typeof filter === 'string' ? filter : filter.label || String(filter);

          return (
            <TouchableOpacity 
              key={index} 
              style={styles.filterButton} 
              onPress={() => onFilterPress(filter)}
            >
              <Text style={styles.filterText}>{filterText}</Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={styles.filterText}>No filters available</Text> // Display a message if no filters
      )}
    </View>
  );
}
