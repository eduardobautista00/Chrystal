import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapComponent from '../../components/MapComponent';
import Logo from '../../components/LogoDashboard';
import FeaturedListing from '../../components/FeaturedListing';
import { useAuth } from "../../context/AuthContext";

const height = Dimensions.get('window').height;

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState('');
  const { authState } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    console.log('Selected Filter in Dashboard:', filter);
  };

  // Check authState and fallback if necessary
  const userRole = authState?.user?.role || 'Guest';  // Example of a fallback

  return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.headerContainer}>
          <Logo />
        </View>
        <MapComponent style={styles.map} selectedFilter={selectedFilter} />
        <FeaturedListing 
          onFilterChange={handleFilterChange}
          selectedFilter={selectedFilter}
        />
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'flex-start',
    //justifyContent: 'flex-start',
    //height: {height}
  },
  headerContainer: {
    //paddingTop: 20, // Add some spacing if needed
    //paddingHorizontal: 15,
  },
  map: {
    flex: 1, // Ensures the map takes full height
  },
});
