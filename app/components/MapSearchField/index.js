import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';
import { useDarkMode } from '../../context/DarkModeContext';

export default function MapSearchField({
  searchValue = '',
  onSearchChange,
  onClear,
  onSearchSubmit,
  onFilterToggle,
  hasFilteredMarkers = false,
  onFocus,
  onBlur,
}) {
  const { isDarkMode } = useDarkMode();
  const [showFilters, setShowFilters] = useState(false); // Track filter tag visibility
  
  const handleFilterToggle = (filter) => {
    // Toggle filter in the selectedFilters array
    onFilterToggle(filter);
  };

  const handleBarangaySelect = (barangay) => {
    onBarangaySelect(barangay); // Set the selected barangay
  };

  return (
    <View style={styles.searchContainer}>
      <View style={[styles.inputContainer, isDarkMode && { backgroundColor: '#1A1A1A', borderColor: '#fff', borderWidth: 1 }]}>
        <FontAwesome name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && { color: '#fff', backgroundColor: '#1A1A1A'}]}
          placeholder={hasFilteredMarkers ? "Search within filtered results" : "Search"}
          value={searchValue}
          onChangeText={onSearchChange}
          placeholderTextColor={isDarkMode ? '#fff' : '#aaa'}
          onSubmitEditing={onSearchSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType="done"
        />

        {searchValue.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <FontAwesome name="times-circle" size={30} color={isDarkMode ? '#fff' : '#ff0000'} />
          </TouchableOpacity>
        )}

        {/* Filter Button
        <TouchableOpacity 
          onPress={() => setShowFilters(!showFilters)} 
          style={[styles.filterButton, showFilters ? styles.filterButtonActive : styles.filterButtonInactive]}
        >
          <MaterialCommunityIcons
            name={showFilters ? "filter" : "filter-outline"}
            size={24}
            color={showFilters ? "#0068C8" : "#aaa"}
          />
        </TouchableOpacity> */}
      </View>

      {/* Barangay Filters Container - shown only when showFilters is true */}
      {showFilters && (
        <View style={styles.filterTagsContainer}>
          {barangays && Array.isArray(barangays) && barangays.length > 0 ? (
            barangays.map((barangay) => (
              <TouchableOpacity
                key={barangay.id}
                onPress={() => handleBarangaySelect(barangay)} // Handle barangay selection
                style={[
                  styles.filterTag,
                  selectedBarangay && selectedBarangay.id === barangay.id && styles.selectedFilterTag, // Highlight the selected barangay
                  selectedFilters.includes(barangay.name) && styles.selectedFilterTag, // Apply selected styles for barangay
                ]}
              >
                <Text
                  style={[
                    styles.filterTagText,
                    selectedBarangay && selectedBarangay.id === barangay.id && styles.selectedFilterTagText, // Change text style for selected barangay
                    selectedFilters.includes(barangay.name) && styles.selectedFilterTagText, // Apply selected text styles
                  ]}
                >
                  {barangay.name}
                </Text>
                {selectedBarangay && selectedBarangay.id === barangay.id && (
                  <TouchableOpacity onPress={() => handleBarangaySelect(null)}>
                    <FontAwesome name="times" size={14} color="#fff" style={styles.removeIcon} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text>No barangays available</Text> // Fallback if no barangays are available
          )}
        </View>
      )}
    </View>
  );
}
