import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import ProfileHeader from '../../components/ProfileHeader';
import StatsCard from '../../components/ProfileStatsCard';
import BackButton from '../../components/ProfileBackButton';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../../context/AuthContext';
import getEnvVars from '../../config/env';
import axios from 'axios';
import { useDarkMode } from '../../context/DarkModeContext';

const { apiUrl } = getEnvVars();

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SettingsScreen = ({ navigation }) => {
  const { authState, logout } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('Notifications');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Create dynamic styles object
  const dynamicStyles = {
    container: {
      flex: 1,
      height: '100vh',
      backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF',
    },
    menuContainer: {
      width: '40%',
      borderRadius: 5,
      borderWidth: 1,
      borderTopWidth: 1,
      backgroundColor: isDarkMode ? '#2D2D2D' : '#FFFFFF',
      borderColor: isDarkMode ? '#404040' : '#000000',
    },
    menuText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#333333',
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    settingText: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#666666',
    },
    logoutText: {
      fontSize: 16,
      textAlign: 'center',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    selectedMenuItem: {
      backgroundColor: isDarkMode ? '#404040' : '#ECEAFF',
    }
  };

  console.log("auth user: ", authState.user);
  console.log('Token being used:', authState.token);


  useEffect(() => {
    const checkPermission = async () => {
      if (!Device.isDevice) {
        Alert.alert('Error', 'Must use physical device for Push Notifications');
        return;
      }

      // Check if user has a device token already
      if (authState.user?.device_token) {
        setPushEnabled(true);
      } else {
        setPushEnabled(false);
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    };

    checkPermission();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, [authState.user?.device_token]);

  const handlePushToggle = async (value) => {
    setPushEnabled(value);
    try {
      if (value) {
        if (!Device.isDevice) {
          Alert.alert('Error', 'Must use physical device for Push Notifications');
          setPushEnabled(false);
          return;
        }

        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          
          try {
            // First attempt with current token
            const response = await axios.post(
              `${apiUrl}/update-device-token`, 
              { device_token: token },
              {
                headers: { 
                  'Authorization': `Bearer ${authState.token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            console.log('Device token update response:', response.data);
            setPushEnabled(true);
            Alert.alert('Push Notifications Enabled', 'You will now receive push notifications.');
          } catch (error) {
            // Revert UI state on error
            setPushEnabled(false);
            
            if (error.response?.status === 401) {
              console.error('Authorization failed. Token:', authState.token);
              // Token expired, log out user and redirect to login
              await logout();
              Alert.alert(
                'Session Expired',
                'Your session has expired. Please log in again.',
              );
            } else {
              Alert.alert('Error', 'Failed to enable notifications. Please try again.');
            }
            return;
          }
        } else {
          setPushEnabled(false);
          Alert.alert('Permission Denied', 'Failed to enable push notifications');
          return;
        }
      } else {
        // Set the state before making the API call
        setPushEnabled(false);
        
        try {
          // Remove token from server
          await axios.post(
            `${apiUrl}/remove-device-token`, 
            { device_token: null },
            { 
              headers: { 
                'Authorization': `Bearer ${authState.token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          Alert.alert('Push Notifications Disabled', 'You will no longer receive push notifications.');
        } catch (error) {
          if (error.response?.status === 401) {
            // Session expired, log out user
            await logout();
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please log in again.',
            );
          } else {
            // For other errors, revert the switch state
            setPushEnabled(true);
            Alert.alert('Error', 'Failed to disable notifications. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      // Only revert the switch state for non-auth errors
      if (error.response?.status !== 401) {
        setPushEnabled(!value);
        Alert.alert('Error', 'Failed to update notification settings');
      }
    }
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
          <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>Settings</Text>
          <TouchableOpacity 
            style={[styles.darkModeButton, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF' }]}
            onPress={toggleDarkMode}
          >
            <Text style={styles.nightModeIcon}>
              {isDarkMode ? '🌙' : '☀️'}
            </Text>
          </TouchableOpacity>
        </View>
        <ProfileHeader isDarkMode={isDarkMode} />
      </LinearGradient>
      <StatsCard isDarkMode={isDarkMode} />
      <View style={styles.settingsContainer}>
        <Text style={dynamicStyles.sectionTitle}>Settings</Text>
        <View style={styles.contentContainer}>
          <View style={dynamicStyles.menuContainer}>
            {['Notifications', 'Security', 'Privacy', 'Support'].map((menu) => (
              <TouchableOpacity
                key={menu}
                style={[
                  styles.menuItem,
                  selectedMenu === menu && dynamicStyles.selectedMenuItem
                ]}
                onPress={() => setSelectedMenu(menu)}
              >
                <Text style={dynamicStyles.menuText}>{menu}</Text>
                {selectedMenu === menu && <View style={styles.selectedIndicator} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]}
              onPress={async () => {
                try {
                  await logout();
                  console.log("Logged out successfully.");
                } catch (error) {
                  console.error("Logout failed:", error.message);
                }
              }}
            >
              <Text style={dynamicStyles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContainer}>
            {selectedMenu === 'Notifications' && (
              <>
                <View style={styles.settingRow}>
                  <Text style={dynamicStyles.settingText}>Push Notifications:</Text>
                  <Switch
                    value={pushEnabled}
                    onValueChange={handlePushToggle}
                    trackColor={{ false: "#767577", true: "#7B61FF" }}
                    thumbColor= '#7B61FF'

                  />
                </View>
                <View style={styles.settingRow}>
                  <Text style={dynamicStyles.settingText}>Email Notifications:</Text>
                  <Switch
                    value={emailEnabled}
                    onValueChange={setEmailEnabled}
                    trackColor={{ false: "#767577", true: "#7B61FF" }}
                    thumbColor= '#7B61FF'
                  />
                </View>
              </>
            )}
            {selectedMenu === 'Security' && (
              <Text style={dynamicStyles.menuText}>Security Settings</Text>
            )}
            {selectedMenu === 'Privacy' && (
              <Text style={dynamicStyles.menuText}>Privacy Settings</Text>
            )}
            {selectedMenu === 'Support' && (
              <Text style={dynamicStyles.menuText}>Support Options</Text>
            )}
          </View>
        </View>
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
  darkModeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12.5,
    paddingVertical: 10,
    borderRadius: 50,
    marginLeft: 'auto',
  },
  settingsContainer: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 20,
    paddingBottom: 20,
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