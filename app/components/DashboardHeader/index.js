import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapFilter from '../MapFilter';
import MapSearchField from '../MapSearchField';
import UserProfileIcon from '../UserProfileIcon';
import Logo from '../Logo';
import styles from './styles';

export default function DashboardHeader({ filters, onFilterPress, searchValue, onSearchChange, onClear, userImageUri }) {
  return (
    <View style={styles.headerContainer}>
      <Logo style={styles.logo}></Logo>
      <View style={styles.searchAndProfile}>
        <MapSearchField 
          searchValue={searchValue} 
          onSearchChange={onSearchChange} 
          onClear={onClear} 
        />
        {/* <UserProfileIcon imageUri={userImageUri}/> */}
      </View>
      <MapFilter filters={filters} onFilterPress={onFilterPress}/>
    </View>
  );
}



