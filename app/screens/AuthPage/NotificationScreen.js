import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileHeader from '../../components/ProfileHeader';
import StatsCard from '../../components/ProfileStatsCard';
import NotificationLists from '../../components/NotificationLists';
import BackButton from '../../components/ProfileBackButton';
import AnimatedBackground from "../../components/AnimatedBackground";
import BottomNavigation from '../../components/BottomNavigation';

const NotificationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0068C8', '#C852FF']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.backButtonContainer}>
          <View style={styles.button}>
            <BackButton navigation={navigation} />
          </View>
          <Text style={styles.title}>Notifications</Text>
        </View>
        <ProfileHeader />
      </LinearGradient>
      <StatsCard />
      {/* PropertyList scrolls independently */}
      <View style={styles.notifListContainer}>
        <NotificationLists navigation={navigation} />
      </View>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    backgroundColor: '#ECEAFF',
    //marginTop: "-50"
  },
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 250,
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    //justifyContent: 'center'
  },
  backButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12.5,
    paddingVertical: 10,
    borderRadius: 50,
  },
  notifListContainer: {
    flex: 1, // Allow the list to take remaining space
    //marginTop: 20,
    // paddingVertical: 20,
  },
});

export default NotificationScreen;
