import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileHeader from '../../components/ProfileHeader';
import StatsCard from '../../components/ProfileStatsCard';
import NotificationLists from '../../components/NotificationLists';
import BackButton from '../../components/ProfileBackButton';
import BackButton from '../../components/ProfileBackButton';
import AnimatedBackground from "../../components/AnimatedBackground";
import BottomNavigation from '../../components/BottomNavigation';
import { useDarkMode } from '../../context/DarkModeContext';



const NotificationScreen = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();

  // Create dynamic styles object
const dynamicStyles = {
  container: {
    flex: 1,
    height: '100vh',
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
          <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>Notifications</Text>
        </View>
        <ProfileHeader isDarkMode={isDarkMode} />
      </LinearGradient>
      <StatsCard isDarkMode={isDarkMode} />
      {/* PropertyList scrolls independently */}
      <View style={styles.notifListContainer}>
        <NotificationLists navigation={navigation} isDarkMode={isDarkMode} />
      </View>
      <BottomNavigation isDarkMode={isDarkMode} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7B61FF',
  }
});

export default NotificationScreen;
