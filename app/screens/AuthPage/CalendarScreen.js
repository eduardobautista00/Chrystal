import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileHeader from '../../components/ProfileHeader';
import StatsCard from '../../components/ProfileStatsCard';
import PropertyList from '../../components/ProfilePropertyList';
import CalendarComponent from '../../components/CalendarComponent';
import BackButton from '../../components/ProfileBackButton';
import BackButton from '../../components/ProfileBackButton';
import AnimatedBackground from "../../components/AnimatedBackground";
import BottomNavigation from '../../components/BottomNavigation';
import { useDarkMode } from '../../context/DarkModeContext';

export default function CalendarScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF',
    },
  };
  return (
    <View style={dynamicStyles.container}>
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
          <Text style={styles.title}>My Calendar</Text>
        </View>
        <ProfileHeader isDarkMode={isDarkMode} />
      </LinearGradient>
      <StatsCard isDarkMode={isDarkMode} />
      <CalendarComponent navigation={navigation} isDarkMode={isDarkMode} />
      <BottomNavigation navigation={navigation} isDarkMode={isDarkMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEAFF',
    //marginTop: '-50',
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
  propertyListContainer: {
    paddingVertical: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Added padding to make sure content is scrollable
  },
});

