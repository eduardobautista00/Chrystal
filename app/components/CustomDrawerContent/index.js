import React from "react";
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Button } from 'react-native-paper';
import styles from './styles';
import { useAuth } from '../../context/AuthContext';

export default function CustomDrawerContent (props) {
  const {authState} = useAuth();
  // console.log(props);
  return (
    <View style={styles.container}>

      <DrawerContentScrollView {...props}>
         <DrawerItemList {...props} /> 
      </DrawerContentScrollView>

      <View style={styles.bottomDrawerSection}>
        <Button 
          icon="logout" 
          mode="contained" 
          onPress={() => {
            props.navigation.closeDrawer();
            authState.logout();
           
          }}
        >
          Logout
        </Button>
      </View>
  </View>
  );
}
