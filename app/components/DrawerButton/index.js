import React from "react";
import { StyleSheet } from "react-native";
import {  DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function DrawerButton ({navigation}) {
  return (
    <TouchableOpacity onPress={() => {
      
        navigation.dispatch(DrawerActions.toggleDrawer())
    }}>
      <Ionicons name="menu" size={24} color="black" style={{ marginLeft: 10 }} />
  </TouchableOpacity> 
  );
}
