import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileHeader from '../../components/ProfileHeader';
import StatsCard from '../../components/ProfileStatsCard';
import NotificationLists from '../../components/NotificationLists';
import BackButton from '../../components/BackButton';
import AnimatedBackground from "../../components/AnimatedBackground";
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { authState } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Notifications');

  const renderOptions = () => {
    switch (selectedMenu) {
      case 'Notifications':
        return (
          <View style={styles.optionsContainer}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Push Notifications:</Text>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: "#767577", true: "#7B61FF" }}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Email Notifications:</Text>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: "#767577", true: "#7B61FF" }}
              />
            </View>
          </View>
        );
      case 'Security':
        return (
          <View style={styles.optionsContainer}>
            <Text style={styles.optionTitle}>Security</Text>
            {/* Add security options here */}
          </View>
        );
      // Add other cases for different menu items
      default:
        return null;
    }
  };

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
            <BackButton goBack={navigation.goBack} />
          </View>
          <Text style={styles.title}>Settings</Text>
        </View>
        <ProfileHeader />
      </LinearGradient>
      <StatsCard />
      
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.contentContainer}>
          {/* Left Menu */}
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={[styles.menuItemTop, selectedMenu === 'Notifications' && styles.selectedMenuItem]}
              onPress={() => setSelectedMenu('Notifications')}
            >
              <Text style={styles.menuText}>
                Notifications
              </Text>
              {selectedMenu === 'Notifications' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, selectedMenu === 'Security' && styles.selectedMenuItem]}
              onPress={() => setSelectedMenu('Security')}
            >
              <Text style={styles.menuText}>
                Security
              </Text>
              {selectedMenu === 'Security' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, selectedMenu === 'Privacy' && styles.selectedMenuItem]}
              onPress={() => setSelectedMenu('Privacy')}
            >
              <Text style={styles.menuText}>
                Privacy
              </Text>
              {selectedMenu === 'Privacy' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, selectedMenu === 'Support' && styles.selectedMenuItem]}
              onPress={() => setSelectedMenu('Support')}
            >
              <Text style={styles.menuText}>
                Support
              </Text>
              {selectedMenu === 'Support' && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]}
              onPress={() => {
                //navigation.closeDrawer();
                authState.logout();
              }}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Right Options Panel */}
          {renderOptions()}
        </View>
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
  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    height: 300,
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
  settingsContainer: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 15,
  },
  menuContainer: {
    width: '40%',
    borderRadius: 5,
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: '#000000',
  },
  menuItemTop: {
    marginTop: 1,
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
    position: 'relative',
    width: '100%',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 10,
    position: 'relative',
    width: '100%',
  },
  selectedMenuItem: {
    backgroundColor: '#ECEAFF',
  },
  selectedIndicator: {
    position: 'absolute',
    right: 10,
    top: '50%',
    bottom: '50%',
    width: 3,
    backgroundColor: '#7B61FF',
    alignSelf: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  logoutItem: {
    marginTop: 'auto',
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  settingText: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen;