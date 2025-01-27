import React from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles';

export default function Logo() {
  const navigation = useNavigation(); // Access the navigation object

  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Image
        source={require("../../../assets/items/Chrystal.png")}
        style={styles.logoImage}
      />
      
      {/* Profile Icon */}
      <TouchableOpacity 
      style={styles.profileIcon} 
      onPress={() => navigation.navigate('ProfileScreen')} // Navigate to the Profile screen
    >
      <Image 
          source={require("../../../assets/items/profile.png")} // Replace with your profile image path
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
}
