import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileHeader from '../../components/ProfileHeader';
import StatsCard from '../../components/ProfileStatsCard';
import PropertyList from '../../components/ProfilePropertyList';
import BackButton from '../../components/ProfileBackButton';
import AnimatedBackground from "../../components/AnimatedBackground";
import BottomNavigation from '../../components/BottomNavigation';
import { useDarkMode } from '../../context/DarkModeContext';

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]}>
      <LinearGradient
        colors={isDarkMode ? ['#004080', '#8C39B5'] : ['#0068C8', '#C852FF']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.backButtonContainer}>
          <View style={[styles.button, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF' }]}>
            <BackButton navigation={navigation} isDarkMode={isDarkMode} />
          </View>
          <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>My Profile</Text>
        </View>
        <ProfileHeader isDarkMode={isDarkMode} />
      </LinearGradient>

      <StatsCard isDarkMode={isDarkMode} />
      <View style={styles.propertyListContainer}>
        <PropertyList navigation={navigation} isDarkMode={isDarkMode} />
      </View>
      
      <BottomNavigation isDarkMode={isDarkMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEAFF',
  },
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 250,
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20
  },
  button: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12.5,
    paddingVertical: 10,
    borderRadius: 50,
  },
  propertyListContainer: {
    flex: 1,
    paddingVertical: 20,
  }
});

export default ProfileScreen;
