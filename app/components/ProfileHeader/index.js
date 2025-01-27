import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { useAuth } from '../../context/AuthContext';
import getEnvVars from '../../config/env';

const ProfileHeader = () => {
  const { authState } = useAuth();
  const { apiUrl } = getEnvVars();
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgentData = async () => {
      if (authState.user.role_name === 'Admin') {
        // Set default data for Admin
        setAgentData({
          firstName: authState.user.first_name,
          lastName: authState.user.last_name,
          company: 'Admin',
          address: 'N/A',
          phone: 'N/A',
          profileImage: null,
        });
      } else if (authState.user.role_name === 'Agent' && authState.user.id) {
        setLoading(true);
        try {
          const response = await fetch(`${apiUrl}/agents`);
          const data = await response.json();
          console.log('API Response:', data); // Log the API response for debugging

          // Find the matching agent
          const matchingAgent = data.agents.find(agent => agent.user_id === authState.user.id);
          
          if (matchingAgent) {
            setAgentData({
              firstName: matchingAgent.user?.first_name || 'N/A',
              lastName: matchingAgent.user?.last_name || 'N/A',
              company: matchingAgent.company?.company_name || 'N/A',
              address: matchingAgent.address || 'N/A',
              phone: matchingAgent.user?.phone_number || 'N/A',
              profileImage: matchingAgent.user?.profile_image || null,
            });
          } else {
            console.error('No matching agent data found.');
            setAgentData({
              firstName: 'Unknown',
              lastName: '',
              company: 'Unknown',
              address: 'Unknown',
              phone: 'Unknown',
              profileImage: null,
            });
          }
        } catch (error) {
          console.error('Failed to fetch agent data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAgentData();
  }, [authState.user, apiUrl]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!agentData) {
    return <Text style={styles.errorText}>Failed to load profile data.</Text>;
  }

  const profileImageUri = agentData.profileImage
    ? { uri: agentData.profileImage }
    : require('../../../assets/items/profile.png');

  return (
    <View style={styles.headerContainer}>
      <Image source={profileImageUri} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{`${agentData.firstName} ${agentData.lastName}`}</Text>
        <Text style={styles.company}>{agentData.company}</Text>
        <View style={styles.infoRow}>
          <Icon name="location" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.address}>{agentData.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="call" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.phone}>{agentData.phone}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
