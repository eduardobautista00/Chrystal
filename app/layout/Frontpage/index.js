import React , {useEffect} from 'react';
import { View, StyleSheet, SafeAreaView , } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';


const Layout = ({ children }) => {

  const { authState } = useAuth();
  

 /*  useEffect(() => {
    // checkUserAuthentication ();
    console.log(authState , "useEffectAuthContext");
  }, [authState]); */




  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>


        {authState.isLoading? (  <ActivityIndicator size="large" color="#0000ff" />) : (children)}

       
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;