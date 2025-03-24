import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { useAuth } from "../../context/AuthContext";
import getEnvVars from '../../config/env';

const StatsCard = ({ isDarkMode }) => {
  const { apiUrl } = getEnvVars();
  const { authState } = useAuth();
  const [propertiesCount, setPropertiesCount] = useState({ available: 0, pending: 0, sold: 0 });
  const [todosCount, setTodosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchProperties = async () => {
      try {
        // Make two separate requests following the API format
        const [userResponse, adminResponse] = await Promise.all([
          fetch(`${apiUrl}/agent/${authState.user.id}/properties`),
          fetch(`${apiUrl}/agent/1/properties`)
        ]);

        const userData = await userResponse.json();
        const adminData = await adminResponse.json();
        
        // Combine both arrays of properties
        const data = [...userData, ...adminData];
        console.log('data:', data);
    
        if (Array.isArray(data)) {
          setPropertiesCount({
            available: data.filter(p => p.status === 'available').length,
            pending: data.filter(p => p.status === 'pending').length,
            sold: data.filter(p => p.status === 'sold').length
          });
        } else {
          setPropertiesCount({ available: 0, pending: 0, sold: 0 });
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setPropertiesCount({ available: 0, pending: 0, sold: 0 });
      }
    };
    

    const fetchTodos = async () => {
      try {
        // Fetch the agents
        const agentsResponse = await fetch(`${apiUrl}/agents`);
        if (!agentsResponse.ok) {
          throw new Error('Failed to fetch agents');
      }
        const agentsData = await agentsResponse.json();
    
        // Find the agent that matches the logged-in user's ID
        const matchingAgent = agentsData.agents.find(agent => agent.user_id === authState.user.id);
        //console.log('Logged-in user ID is not available. Skipping fetch.' ,matchingAgent);
    
        if (!matchingAgent) {
          //console.warn('Logged-in user ID is not available. Skipping fetch.' ,matchingAgent);
          setTodosCount(0);
          return;
        }
        // Fetch todos for the logged-in agent
        const todosResponse = await fetch(`${apiUrl}/todos/agent/${matchingAgent.id}`); // Adjust query parameter as needed
        //console.warn('todos count response:' ,todosResponse);
        const todosData = await todosResponse.json();
        //console.warn('todos count:' ,todosData);
    
        setTodosCount(todosData.todos.length || 0); // Fallback if length is not defined
      } catch (error) {
        console.error('Error fetching todos or agents:', error);
        setTodosCount(0);
      }
    };
    

    const initialFetch = async () => {
      setLoading(true);
      await fetchProperties();
      await fetchTodos();
      setLoading(false);
    };

    const startPolling = () => {
      interval = setInterval(() => {
        fetchProperties();
        fetchTodos();
      }, 50000);
    };

    if (authState.user && authState.user.id) {
      initialFetch().then(() => startPolling());
    }

    return () => clearInterval(interval);
  }, [authState.user.id]);

  return (
    <View style={[styles.statsContainer, isDarkMode && { backgroundColor: '#1A1A1A' }]}>
      {loading ? (
        <Text style={[styles.loadingText, isDarkMode && { color: '#fff' }]}>Loading...</Text>
      ) : (
        <>
          <View style={styles.stat}>
            <View style={styles.statNumberContainer}>
              <View style={styles.statItem}>
                <Icon style={styles.statIcon} name="home" size={22} color="#0000FF" /> 
                <Text style={[styles.statNumber, isDarkMode && { color: '#fff' }]}>{propertiesCount.available}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon style={styles.statIcon} name="hourglass-half" size={22} color="#FFA500" /> 
                <Text style={[styles.statNumber, isDarkMode && { color: '#fff' }]}>{propertiesCount.pending}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon style={styles.statIcon} name="check-circle" size={22} color="#008000" /> 
                <Text style={[styles.statNumber, isDarkMode && { color: '#fff' }]}>{propertiesCount.sold}</Text>
              </View>
            </View>

           <View style={styles.statLabelContainer}>
            <Text style={[styles.statLabel, isDarkMode && { color: '#fff' }]}>Properties</Text>
            </View>
          </View>
        
        
          <View style={styles.stat}>
            <Text style={[styles.statNumber, isDarkMode && { color: '#fff' }]}>{todosCount}</Text>
            <Text style={[styles.statLabel, isDarkMode && { color: '#fff' }]}>To-do's</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default StatsCard;
