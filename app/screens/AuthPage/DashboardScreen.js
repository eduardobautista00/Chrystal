import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import MapComponent from '../../components/MapComponent';
import MapSearchField from '../../components/MapSearchField';
import Logo from '../../components/LogoDashboard';
import VerticalContainer from '../../components/VerticalContainer';
import AnimatedBackground from "../../components/AnimatedBackground";
import { useAuth } from "../../context/AuthContext";
import Pusher from 'pusher-js/react-native';


export default function Dashboard() {
  const [searchValue, setSearchValue] = useState(''); // To manage the search input
  const [selectedFilters, setSelectedFilters] = useState([]); // To manage selected filters
  const { authState } = useAuth();


  console.log(authState.user, "user role")

  

  // Handle change in search input
  const handleSearchChange = (text) => {
    setSearchValue(text);
  };

  // Handle clearing the search input
  const handleClear = () => {
    setSearchValue('');
  };

  // Handle filter toggle (add or remove filter)
  const handleFilterToggle = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((item) => item !== filter) // Remove filter
        : [...prevFilters, filter] // Add filter
    );
  };

  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Use 'padding' for iOS, 'height' for Android
    >
      <View style={styles.headerContainer}>
        <Logo />
        {/* <MapSearchField
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onClear={handleClear}
          onFilterToggle={handleFilterToggle}
          selectedFilters={selectedFilters}
        /> */}
      </View>
      <MapComponent style={styles.map} />
      <VerticalContainer />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    //marginTop: '-20',
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1, // Ensure the map takes up available space
  },
});
