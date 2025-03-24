import React, { useState, useEffect, useRef, useMemo  } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  Dimensions,
  Switch,
  Switch,
} from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';
import YearlyCalendar from '../YearlyCalendar'
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker for time input
import styles from './styles';
import getEnvVars from '../../config/env';
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../core/theme';
import { theme } from '../../core/theme';
import * as Notifications from 'expo-notifications';
import { useDarkMode } from '../../context/DarkModeContext';

export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Set default to today
  const [todos, setTodos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [time, setTime] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mainTab, setMainTab] = useState('monthly'); // Default main tab set to monthly
  const [modalTab, setModalTab] = useState('seller'); // Default modal tab set to seller
  const { apiUrl } = getEnvVars();
  const dateColorMap = useRef({});
  const { authState } = useAuth();
  const { isDarkMode } = useDarkMode();
  const flatListRef = useRef(null); // Initialize flatListRef
  const screenWidth = Dimensions.get('window').width;
  const [selectedHour, setSelectedHour] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // New buyer todo form states
  const [buyerFirstName, setBuyerFirstName] = useState('');
  const [buyerLastName, setBuyerLastName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [selectedBuyerProperties, setSelectedBuyerProperties] = useState([]);
  const [buyerTodoTitle, setBuyerTodoTitle] = useState('');
  const [buyerAlreadyExists, setBuyerAlreadyExists] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerData, setBuyerData] = useState(null);

  const [openProperty, setOpenProperty] = useState(false);
  const [value, setValue] = useState(null);
  
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [openBuyerProperties, setOpenBuyerProperties] = useState(false);
  const [timeConflictModalVisible, setTimeConflictModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [openBuyer, setOpenBuyer] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [buyerItems, setBuyerItems] = useState([]);

  // Function to fetch buyer data by email with debounce
  const fetchBuyerDataByEmail = async (searchText) => {
    try {
      const response = await fetch(`${apiUrl}/buyers/search?email=${searchText}`);
      const data = await response.json();
      // Transform the data into the format required by DropDownPicker
      const formattedItems = data.map(buyer => ({
        label: buyer.email,
        value: buyer.email
      }));
      setBuyerItems(formattedItems);
    } catch (error) {
      console.error('Error fetching buyer data:', error);
    }
  };

  // Load todos from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Error loading todos from AsyncStorage:", error);
      }
    };

    loadTodos();
  }, []);

  // Save todos to AsyncStorage whenever they change
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error("Error saving todos to AsyncStorage:", error);
      }
    };

    saveTodos();
  }, [todos]);
  
  // Fetching properties (example fetch)
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch all properties
        const response = await fetch(`${apiUrl}/properties`);
        const data = await response.json();
  
        // Ensure the data is an array
        const propertyArray = Array.isArray(data.property) ? data.property : [];
  
        // Get the logged-in user's ID
        const loggedInUserId = authState?.user?.id;
  
        if (!loggedInUserId) {
          console.warn('Logged-in user ID is not available. Skipping fetch.');
          setProperties([]);
          return;
        }
  
        // Filter properties based on the logged-in user's ID
        const userProperties = propertyArray.filter(
          property => (property.user_id === loggedInUserId || property.user_id === 1) && property.status === 'available'
        );
  
        setProperties(userProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
  
    fetchProperties();
  }, [authState?.user?.id]); // Dependency to re-run if the user's ID changes

  const handleBuyerAlreadyExists = (value) => {
    setBuyerAlreadyExists(value); // Set state directly based on the switch value
    console.log('Buyer Already Exists:', value);
  }

  const handleBuyerAlreadyExists = (value) => {
    setBuyerAlreadyExists(value); // Set state directly based on the switch value
    console.log('Buyer Already Exists:', value);
  }
  

  const handleDatePress = (date) => {
    setSelectedDate(date.dateString);
    setModalVisible(true);
  };

  const handleEditTodo = async (todoId) => {
    const todo = todos[selectedDate].find(t => t.id === todoId);
    if (!todo) {
      Alert.alert('Error', 'Todo not found');
      return;
    }
    setEditingTodoId(todoId);
    console.log('editing todo id:', todoId )
    setNewTodo(todo.title);
    setTime(new Date(todo.deadline));
    setSelectedProperty(properties.find(p => p.id === todo.property_id));
    setModalVisible(true);
  };

  const handleEditTodoSubmit = async (todoId) => {
    if (newTodo && selectedDate && selectedProperty && time) {
      try {
        const formattedTime = time instanceof Date
          ? time.toTimeString().slice(0, 5)
          : time;
        const formattedDeadline = `${selectedDate}T${formattedTime}`;
  
        const todoData = {
          id: todoId, // Ensure the ID is included
          title: newTodo,
          deadline: formattedDeadline,
          property_id: selectedProperty.id,
          agent_id: authState.user.id,
          for_buyer: false,
        };
  
        const response = await fetch(`${apiUrl}/update-todos/${todoId}`, {
          method: 'PUT',  // Ensure your API supports PUT, or change to PATCH if needed
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(todoData),
        });
  
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
  
          if (!response.ok) {
            console.error('API Error Response:', data);
            throw new Error(`Failed to update To-Do: ${data.message || 'Unknown error'}`);
          }
  
          Alert.alert('Success', 'To-Do Updated Successfully');
          resetForm();
          setModalVisible(false);
          setEditingTodoId(null);
          await fetchTodos(); // Refresh the list to reflect updates
        } else {
          const rawResponse = await response.text();
          console.error('Unexpected Response:', rawResponse);
          throw new Error('Unexpected response format from server');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', error.message || 'An error occurred while updating the To-Do');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };
  

  const checkExistingTodoAtTime = (selectedDate, selectedTime, todos) => {
    if (!todos[selectedDate]) return false;

    const timeStr = selectedTime instanceof Date 
      ? selectedTime.toTimeString().slice(0, 5)
      : selectedTime;

    return todos[selectedDate].some(todo => {
      const todoTime = new Date(todo.deadline).toTimeString().slice(0, 5);
      return todoTime === timeStr;
    });
  };

  const checkExistingTodoAtTime = (selectedDate, selectedTime, todos) => {
    if (!todos[selectedDate]) return false;

    const timeStr = selectedTime instanceof Date 
      ? selectedTime.toTimeString().slice(0, 5)
      : selectedTime;

    return todos[selectedDate].some(todo => {
      const todoTime = new Date(todo.deadline).toTimeString().slice(0, 5);
      return todoTime === timeStr;
    });
  };

  const handleAddTodo = async () => {
    if (newTodo && selectedDate && selectedProperty && time) {
      const hasExistingTodo = checkExistingTodoAtTime(selectedDate, time, todos);
      
      if (hasExistingTodo) {
        setPendingAction(() => processAddTodo);
        setTimeConflictModalVisible(true);
        return;
      }

      processAddTodo();
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleAddBuyerTodo = async () => {
    if (loading) return;

    let errorMessages = [];

    // Validation logic using if-else for buyerAlreadyExists
    if (buyerAlreadyExists) {
      // Collect error messages for fields when buyer already exists
      if (!buyerEmail) {
        errorMessages.push('Buyer Email');
      }
      if (!buyerTodoTitle) {
        errorMessages.push('To-Do Title');
      }
      if (selectedBuyerProperties.length === 0) {
        errorMessages.push('Property/s');
      }
    } else {
      // Collect error messages for fields when buyer does not exist
      if (!buyerFirstName) {
        errorMessages.push('Buyer First Name');
      }
      if (!buyerLastName) {
        errorMessages.push('Buyer Last Name');
      }
      if (!buyerPhone) {
        errorMessages.push('Buyer Phone Number');
      }
      if (selectedBuyerProperties.length === 0) {
        errorMessages.push('Property/s');
      }
      if (!buyerTodoTitle) {
        errorMessages.push('To-Do Title');
      }
      if (!buyerEmail) {
        errorMessages.push('Buyer Email');
      }
    }

    // If there are any error messages, alert the user
    if (errorMessages.length > 0) {
      Alert.alert('Please fill in all empty fields', errorMessages.join('\n'));
      return;
    }

    const hasExistingTodo = checkExistingTodoAtTime(selectedDate, time, todos);
      
    if (hasExistingTodo) {
      setPendingAction(() => processBuyerTodo);
      setTimeConflictModalVisible(true);
      return;
    }

    processBuyerTodo();
  };

  // Helper function to process adding a regular todo
  const processAddTodo = async () => {
    try {
      const agentResponse = await fetch(`${apiUrl}/agents`);
      if (!agentResponse.ok) {
        throw new Error('Failed to fetch agents');
      }
      const agentData = await agentResponse.json();

      const matchingAgent = agentData.agents.find(
        agent => agent.user_id === authState.user.id
      );
      if (!matchingAgent) {
        throw new Error('Agent not found');
      }

      const formattedTime = time instanceof Date
        ? time.toTimeString().slice(0, 5)
        : time;

      const formattedDeadline = `${selectedDate}T${formattedTime}`;

      const todoData = {
        title: newTodo,
        deadline: formattedDeadline,
        property_id: selectedProperty,
        agent_id: matchingAgent.id,
        for_buyer: false,
      };

      console.log('Request Data:', todoData);

      const response = await fetch(`${apiUrl}/to-do-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
          console.error('API Error Response:', data);
          throw new Error(`Failed to create To-Do: ${data.message || 'Unknown error'}`);
        }

        console.log('Response Data:', data);
        // Success feedback
        Alert.alert('Success', 'To-Do Created Successfully');
        resetForm(); // Reset the form after adding the todo
        setSelectedProperty(null); // Reset the selected property
        setValue(null);
        setModalVisible(false); // Close the modal
        await fetchTodos(); // Fetch todos again to reflect the newly added todo
      } else {
        const rawResponse = await response.text();
        console.error('Unexpected Response:', rawResponse);
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'An error occurred while adding the To-Do');
    }
  };

  // Helper function to process adding a buyer todo
  const processBuyerTodo = async () => {
      const hasExistingTodo = checkExistingTodoAtTime(selectedDate, time, todos);
      
      if (hasExistingTodo) {
        setPendingAction(() => processAddTodo);
        setTimeConflictModalVisible(true);
        return;
      }

      processAddTodo();
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleAddBuyerTodo = async () => {
    if (loading) return;

    let errorMessages = [];

    // Validation logic using if-else for buyerAlreadyExists
    if (buyerAlreadyExists) {
      // Collect error messages for fields when buyer already exists
      if (!buyerEmail) {
        errorMessages.push('Buyer Email');
      }
      if (!buyerTodoTitle) {
        errorMessages.push('To-Do Title');
      }
      if (selectedBuyerProperties.length === 0) {
        errorMessages.push('Property/s');
      }
    } else {
      // Collect error messages for fields when buyer does not exist
      if (!buyerFirstName) {
        errorMessages.push('Buyer First Name');
      }
      if (!buyerLastName) {
        errorMessages.push('Buyer Last Name');
      }
      if (!buyerPhone) {
        errorMessages.push('Buyer Phone Number');
      }
      if (selectedBuyerProperties.length === 0) {
        errorMessages.push('Property/s');
      }
      if (!buyerTodoTitle) {
        errorMessages.push('To-Do Title');
      }
      if (!buyerEmail) {
        errorMessages.push('Buyer Email');
      }
    }

    // If there are any error messages, alert the user
    if (errorMessages.length > 0) {
      Alert.alert('Please fill in all empty fields', errorMessages.join('\n'));
      return;
    }

    const hasExistingTodo = checkExistingTodoAtTime(selectedDate, time, todos);
      
    if (hasExistingTodo) {
      setPendingAction(() => processBuyerTodo);
      setTimeConflictModalVisible(true);
      return;
    }

    processBuyerTodo();
  };

  // Helper function to process adding a regular todo
  const processAddTodo = async () => {
    try {
      const agentResponse = await fetch(`${apiUrl}/agents`);
      if (!agentResponse.ok) {
        throw new Error('Failed to fetch agents');
      }
      const agentData = await agentResponse.json();

      const matchingAgent = agentData.agents.find(
        agent => agent.user_id === authState.user.id
      );
      if (!matchingAgent) {
        throw new Error('Agent not found');
      }

      const formattedTime = time instanceof Date
        ? time.toTimeString().slice(0, 5)
        : time;

      const formattedDeadline = `${selectedDate}T${formattedTime}`;

      const todoData = {
        title: newTodo,
        deadline: formattedDeadline,
        property_id: selectedProperty,
        agent_id: matchingAgent.id,
        for_buyer: false,
      };

      console.log('Request Data:', todoData);

      const response = await fetch(`${apiUrl}/to-do-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
          console.error('API Error Response:', data);
          throw new Error(`Failed to create To-Do: ${data.message || 'Unknown error'}`);
        }

        console.log('Response Data:', data);
        // Success feedback
        Alert.alert('Success', 'To-Do Created Successfully');
        resetForm(); // Reset the form after adding the todo
        setSelectedProperty(null); // Reset the selected property
        setValue(null);
        setModalVisible(false); // Close the modal
        await fetchTodos(); // Fetch todos again to reflect the newly added todo
      } else {
        const rawResponse = await response.text();
        console.error('Unexpected Response:', rawResponse);
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'An error occurred while adding the To-Do');
    }
  };

  // Helper function to process adding a buyer todo
  const processBuyerTodo = async () => {
    try {
      setLoading(true);

      setLoading(true);

      const agentResponse = await fetch(`${apiUrl}/agents`);
      if (!agentResponse.ok) {
        throw new Error('Failed to fetch agents');
      }
      const agentData = await agentResponse.json();


      const matchingAgent = agentData.agents.find(agent => agent.user_id === authState.user.id);
      if (!matchingAgent) {
        throw new Error('Agent not found');
      }


      const formattedTime = time instanceof Date
        ? time.toTimeString().slice(0, 5)
        ? time.toTimeString().slice(0, 5)
        : time;

      const formattedDeadline = `${selectedDate}T${formattedTime}`;

      const formattedDeadline = `${selectedDate}T${formattedTime}`;
      console.log('selected properties', selectedBuyerProperties);

      let todoData;

      if (buyerAlreadyExists) {
        todoData = {
          title: buyerTodoTitle,
          deadline: formattedDeadline,
          property_ids: selectedBuyerProperties,
          agent_id: matchingAgent.id,
          for_buyer: true,
          buyer_id: buyerData.buyer_id,
          buyer_already_exists: buyerAlreadyExists,
        };
      } else {
        todoData = {
          title: buyerTodoTitle,
          deadline: formattedDeadline,
          property_ids: selectedBuyerProperties,
          agent_id: matchingAgent.id,
          for_buyer: true,
          buyer_first_name: buyerFirstName,
          buyer_last_name: buyerLastName,
          buyer_address: buyerAddress,
          buyer_phone_number: buyerPhone,
          email: buyerEmail,
          buyer_already_exists: buyerAlreadyExists,
        };
      }


      let todoData;

      if (buyerAlreadyExists) {
        todoData = {
          title: buyerTodoTitle,
          deadline: formattedDeadline,
          property_ids: selectedBuyerProperties,
          agent_id: matchingAgent.id,
          for_buyer: true,
          buyer_id: buyerData.buyer_id,
          buyer_already_exists: buyerAlreadyExists,
        };
      } else {
        todoData = {
          title: buyerTodoTitle,
          deadline: formattedDeadline,
          property_ids: selectedBuyerProperties,
          agent_id: matchingAgent.id,
          for_buyer: true,
          buyer_first_name: buyerFirstName,
          buyer_last_name: buyerLastName,
          buyer_address: buyerAddress,
          buyer_phone_number: buyerPhone,
          email: buyerEmail,
          buyer_already_exists: buyerAlreadyExists,
        };
      }

      const response = await fetch(`${apiUrl}/to-do-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(todoData),
      });


      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Invalid JSON response from server');
      }


      if (response.ok) {
        Alert.alert('Success', 'Buyer To-Do added successfully');
        // Reset buyer form
        resetForm();
        setModalVisible(false);
        await fetchTodos();
        setModalVisible(false);
        await fetchTodos();
      } else {
        Alert.alert('Error', data.message || 'Failed to add buyer to-do');
      }
    } catch (error) {
      console.error('Error adding buyer to-do:', error);
      Alert.alert('Error', 'An error occurred while adding the buyer to-do');
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  
  const handleDeleteTodo = async (todoId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this To-Do?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
          try {
            const response = await fetch(`${apiUrl}/todos/${todoId}`, {
              method: 'DELETE',
            });
      
            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(`Failed to delete todo: ${errorData}`);
            }
      
            Alert.alert('Success', 'Todo deleted successfully');
            //setModalVisible(false);
            await fetchTodos();
           
          } catch (error) {
            Alert.alert('Error', error.message || 'An error occurred while deleting the todo');
          }
        }}
      ]
    );
  };

  const groupTodosByDate = (todos) => {
    return todos.reduce((acc, todo) => {
      const [date, time] = todo.deadline.split(' '); // Split deadline into date and time
  
      if (!acc[date]) {
        acc[date] = [];
      }
  
      acc[date].push({
        ...todo,
        deadline_date: date, // Add normalized date
        deadline_time: time, // Add extracted time
      });
  
      return acc;
    }, {});
  };
  
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
  
    try {
      console.log('Starting to fetch agents...');
      // Fetch agents
      const agentResponse = await fetch(`${apiUrl}/agents`);
      console.log('Agent response status:', agentResponse.status);
  
      if (!agentResponse.ok) {
        throw new Error('Failed to fetch agents');
      }
      const agentData = await agentResponse.json();
      console.log('Fetched agent data:', agentData);
  
      // Find the matching agent
      const matchingAgent = agentData.agents.find(agent => agent.user_id === authState.user.id);
      console.log('Matching agent:', matchingAgent);
  
      if (matchingAgent) {
        console.log('Starting to fetch properties...');
        // Fetch properties for the logged-in user
        const propertiesResponse = await fetch(`${apiUrl}/properties`);
        console.log('Properties response status:', propertiesResponse.status);
  
        if (!propertiesResponse.ok) {
          throw new Error('Failed to fetch properties');
        }
        const propertiesData = await propertiesResponse.json();
        console.log('Fetched properties data:', propertiesData);
  
        // Property filtering debug logs
        console.log("User ID to filter by:", authState.user.id);
        propertiesData.property.forEach(property => {
          console.log(`Property ID: ${property.id}, user_id: ${property.user_id}, matches: ${property.user_id === authState.user.id}`);
        });
  
        // Filter properties by user_id
        const userProperties = Array.isArray(propertiesData.property)
          ? propertiesData.property.filter(property => property.user_id === authState.user.id)
          : [];
        console.log('Filtered user properties:', userProperties);
  
        console.log('Starting to fetch todos for agent ID:', matchingAgent.id);
        // Fetch todos for the matching agent
        const todosResponse = await fetch(`${apiUrl}/todos/agent/${matchingAgent.id}`);
        console.log('Todos response status:', todosResponse.status);
  
        if (!todosResponse.ok) {
          throw new Error('Failed to fetch todos');
        }
  
        const todosData = await todosResponse.json();
        console.log('Fetched todos data:', todosData);
  
        const todosArray = Array.isArray(todosData.todos) ? todosData.todos : [];
        console.log('Normalized todos array:', todosArray);
  
        console.log('Enhancing todos with property names...');
        // Enhance todos with property names
        const enhancedTodos = todosArray.map(todo => {
          const matchingProperty = userProperties.find(property => property.id === todo.property_id);
          console.log('matched property', matchingProperty)
          return {
            ...todo,
            property_name: matchingProperty ? matchingProperty.property_name : 'Unknown Property',
          };
        });
        console.log('Enhanced todos:', enhancedTodos);
  
        console.log('Grouping todos by date...');
        // Group todos by date after normalizing the deadline format
        const groupedTodos = groupTodosByDate(enhancedTodos);
        console.log('Grouped todos:', groupedTodos);
  
        setTodos(groupedTodos);
      } else {
        console.warn('No matching agent found for user ID:', authState.user.id);
        setTodos([]);
      }
    } catch (err) {
      console.error('Error fetching todos:', err.message);
      setError(err.message);
    } finally {
      console.log('Fetch process completed.');
      setLoading(false);
    }
  };


  const dayComponent = ({ date, state }) => {
    const dayTodos = todos[date.dateString]; // Use the selected date's deadline_date to find todos
  
    const isToday = date.dateString === new Date().toISOString().split('T')[0]; // Check if it's today's date

    const isExtraDay = state === 'disabled'; // Check if the day is from the previous or next month
  
    return (
      <TouchableOpacity
        style={[
          styles.dayContainer,
          { borderRadius: 10 }, // Rectangular day cell
          state === 'selected' ? { backgroundColor: '#7B61FF' } : { backgroundColor: '#ECEAFF' },
          isDarkMode ? { backgroundColor: '#1A1A1A' } : { backgroundColor: '#ECEAFF' },
          { borderColor: isDarkMode ? '#ddd' : '#ddd' },
          { borderWidth: isDarkMode ? 0.5 : 1 },
        ]}
        onPress={() => handleDatePress(date)} // Enable interaction for all dates
      >
        <View
          style={[
            styles.dayCircle, // Circle wrapper
            isToday ? styles.todayCircle : null, // Apply circle only for today
          ]}
        >
          <Text
            style={[
              styles.dayText,
              isToday ? styles.todayText : {}, // Special styling for today's text
              state === 'selected' ? styles.selectedDay : {},
              //isExtraDay ? { color: '#B0B0B0' } : {}, // Grayed-out text for extra days
              isDarkMode ? { color: '#ECEAFF' } : { color: '#1A1A1A' },
            ]}
          >
            {date.day}
          </Text>
        </View>
  
        {/* Render todos for this date */}
        {dayTodos && dayTodos.length > 0 && (
          <View
            key={0}
            style={[
              styles.todoTag,
              { backgroundColor: '#7B61FF' }, // Consistent color for the todo tag
            ]}
          >
            <Text
              style={styles.todoText}
              numberOfLines={1} // Truncate long text
              ellipsizeMode="tail" // Add "..." for long text
            >
              {dayTodos[0].title} {/* Render only the first todo */}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const resetForm = () => {
    setNewTodo('');
    setTime(null);
    setSelectedProperty(null);
    setBuyerFirstName('');
    setBuyerLastName('');
    setBuyerAddress('');
    setBuyerPhone('');
    setSelectedBuyerProperties([]);
    setBuyerTodoTitle('');
    setBuyerAlreadyExists(false);
    setBuyerEmail('');
    setBuyerAlreadyExists(false);
    setBuyerEmail('');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const renderTodosForDay = (todosForDay) => {
    if (loading) {
      return <ActivityIndicator size="large" color="#ECEAFF" />;
    }

    if (error) {
      return <Text style={{ color: 'red' }}>{`Error: ${error}`}</Text>;
    }

    if (!selectedDate || !todosForDay || todosForDay.length === 0) {
      return <Text>No To-Do's for this day</Text>;
    }


    return (
      <FlatList
        data={todosForDay}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.title}</Text>
            <Text>
              {`Time: ${item.deadline_time} - `}
              <Text style={{ fontWeight: 'bold', color: item.status === 'done' ? 'green' : item.status === 'pending' ? 'orange' : item.status === 'due' ? 'red' : 'black' }}>
                {item.status.toUpperCase()}
              </Text>
            </Text>
            <Text>{`Property: ${item.property_name || 'None'}`}</Text>
            
            {/* Action buttons for each To-Do */}
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.doneButton, item.status === 'done' || item.status === 'due' && styles.disabledDoneButton]} 
                onPress={() => handleMarkAsDone(item.id)} 
                disabled={item.status === 'done' || item.status === 'due'} // Disable if status is done
              >
                <Text style={styles.actionButtonText}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editButton, item.status === 'done' || item.status === 'due' && styles.disabledEditButton]} 
                onPress={() => handleEditTodo(item.id)} 
                disabled={item.status === 'done' || item.status === 'due'} // Disable if status is done
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteTodo(item.id)} 
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => `${item.id}`} // Use `item.id` as a unique key for each To-Do
      />
    );
  };

  // Memoized data array with the current date appearing first
const data = useMemo(() => {
  if (loading) return []; // Return an empty array if data is still loading

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const pastDays = Array.from({ length: 365 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (365 - index));
      const formattedDate = date.toISOString().split('T')[0];
      return { date: formattedDate, todos: todos[formattedDate] || [] };
  });

  const futureDays = Array.from({ length: 365 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const formattedDate = date.toISOString().split('T')[0];
      return { date: formattedDate, todos: todos[formattedDate] || [] };
  });

  const currentDayData = {
      date: todayString,
      todos: todos[todayString] || [],
  };

  // Ensure the current day is included only once
  const filteredPastDays = pastDays.filter((day) => day.date !== todayString);
  const filteredFutureDays = futureDays.filter((day) => day.date !== todayString);

  // Place the current date at the start of the array
  return [...filteredPastDays, currentDayData,  ...filteredFutureDays];
}, [todos, loading]);


if (loading) {
  return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading calendar...</Text>
      </View>
  );
}

const RenderItem = React.memo(({ item }) => {
  if (!item) return null;

  const formattedDate = useMemo(() => {
      const dateInstance = new Date(item.date);
      return {
          month: dateInstance.toLocaleString('default', { month: 'long' }),
          weekday: dateInstance.toLocaleString('default', { weekday: 'short' }),
          day: dateInstance.getDate(),
      };
  }, [item.date]);

  const isToday = useMemo(() => {
      const today = new Date().toISOString().split('T')[0];
      return item.date === today;
  }, [item.date]);

  const [timePosition, setTimePosition] = useState(() =>
      isToday ? calculateTimePosition() : null
  );

  useEffect(() => {
      if (!isToday) return; // Only run for today's date
      const interval = setInterval(() => {
          setTimePosition(calculateTimePosition());
      }, 60000); // Update every minute

      return () => clearInterval(interval); // Cleanup
  }, [isToday]);

  return (
      <View
          style={styles.dailyCalendarContainer}
      >
          <View style={styles.dateHeaderContainer}>
              <View style={[styles.dateContainer, { borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                  <Text style={[styles.dateHeader, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{formattedDate.month}</Text>
                  <Text style={[styles.dateHeader, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{formattedDate.weekday}</Text>
                  <Text
                      style={[
                          styles.dateHeader,
                          { color: isDarkMode ? '#FFFFFF' : '#000000' },
                          isToday && styles.todayDayIndicator,
                      ]}
                  >
                      {formattedDate.day}
                  </Text>
              </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
              <View style={{ position: 'relative' }}>
                  {isToday && timePosition !== null && (
                      <View
                          style={[
                              styles.currentTimeMarker,
                              { top: timePosition },
                          ]}
                      >
                          <Text style={styles.currentTimeDot}>•</Text>
                          <View style={styles.currentTimeLine} />
                      </View>
                  )}
                  <GridView todos={item.todos} openModal={(hour) => {
                      const selectedTime = new Date();
                      selectedTime.setHours(hour, 0, 0); // Set minutes and seconds to 00
                      setTime(selectedTime);
                      setSelectedHour(hour);
                      setSelectedDate(item.date); // Update selectedDate based on the item date
                      setModalVisible(true);
                  }} />
              </View>
          </ScrollView>
      </View>
  );
});

const calculateTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const percentageOfDay = totalMinutes / (24 * 60); // Total minutes in a day
  const gridHeight = 24 * 100; // Assuming each hour row has 50px height
  return percentageOfDay * gridHeight;
};

// Memoized GridView for the 24-hour grid
const GridView = React.memo(({ todos, openModal }) => {
  const currentHour = new Date().getHours(); // Get the current hour
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: 24 }, (_, hour) => {
        const hourString = `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? ' AM' : ' PM'}`;
        const hasTodo = todos.some((todo) => {
          const todoHour = new Date(todo.deadline_time).getHours();
          return todoHour === hour;
        });

        const isSelected = selectedHour === hour; // Check if the row is selected

        return (
          <View key={hour} style={[styles.gridRow, { borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            <View style={[styles.timeHeaderContainer, { borderColor: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              <Text style={[styles.timeHeader, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{hourString}</Text>
            </View>
            <TouchableOpacity style={[styles.todoMarkContainer, isSelected && styles.selectedRow]} onPress={() => openModal(hour)}>
              {todos.map((todo, index) => {
                const todoHour = new Date(todo.deadline).getHours();
                if (todoHour === hour) {
                  return (
                    <View key={index} style={{ backgroundColor: '#7B61FF', padding: 5, borderRadius: 5 }}>
                      <Text style={styles.todoMark}>{todo.title}</Text>
                    </View>
                  );
                }
                return null;
              })}
            </TouchableOpacity>
            {/* {isCurrentHour && (
              <View style={styles.currentTimeMarker}>
                <Text style={styles.currentTimeDot}>•</Text>
                <View style={styles.currentTimeLine} />
              </View>
            )} */}
          </View>
        );
      })}
    </View>
  );
});

const handlePropertyChange = (value) => {
  setSelectedProperties(value);
};

const handleBuyerPropertyChange = (value) => {
  setSelectedBuyerProperties(value);
};

const handleMarkAsDone = async (todoId) => {
  try {
    // Fetch agents to get the agentId
    const response = await fetch(`${apiUrl}/agents`);
    if (!response.ok) {
      throw new Error("Failed to fetch agents");
    }
    const data = await response.json();

    const matchingAgent = data.agents.find((agent) => agent.user_id === authState.user.id);
    if (!matchingAgent) {
      throw new Error("Agent not found");
    }

    const agentId = matchingAgent.id; // Get the agentId

    const markResponse = await fetch(`${apiUrl}/todo/${todoId}/mark-as-done`, {
      method: 'POST', // Corrected method to POST
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        status: 'done', // Set the status to 'done'
        agent_id: agentId, // Pass the agent ID
      }),
    });

    if (!markResponse.ok) {
      const errorData = await markResponse.text();
      throw new Error(`Failed to mark todo as done: ${errorData}`);
    }

    Alert.alert('Success', 'Todo marked as done');
    await fetchTodos(); // Refresh the To-Do list
  } catch (error) {
    console.error('Error marking todo as done:', error);
    Alert.alert('Error', 'An error occurred while marking the todo as done');
  }
};

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]}>
      <View style={[styles.mainTabContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]}>
        <TouchableOpacity 
          style={[styles.tab, mainTab === 'daily' && styles.selectedTab]}
          onPress={() => setMainTab('daily')}
        >
          <Text style={[styles.tabText, { color: isDarkMode ? '#fff' : '#1A1A1A' }, mainTab === 'daily' && styles.selectedTabText]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mainTab === 'monthly' && styles.selectedTab]}
          onPress={() => setMainTab('monthly')}
        >
          <Text style={[styles.tabText, { color: isDarkMode ? '#fff' : '#1A1A1A' }, mainTab === 'monthly' && styles.selectedTabText]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mainTab === 'yearly' && styles.selectedTab]}
          onPress={() => setMainTab('yearly')}
        >
          <Text style={[styles.tabText, { color: isDarkMode ? '#fff' : '#1A1A1A' }, mainTab === 'yearly' && styles.selectedTabText]}>Yearly</Text>
        </TouchableOpacity>
      </View>

      

      {mainTab === 'daily' && (
  <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={data.length > 0 ? data : []} // Render only when data is available
        renderItem={({ item }) => item && <RenderItem item={item} />}
        keyExtractor={(item, index) => `${item.date}-${index}`} 
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        initialScrollIndex={data.findIndex((item) => item.date === new Date().toISOString().split('T')[0])} // Default to today's date
        initialNumToRender={3} // Reduce initial rendering load
        maxToRenderPerBatch={5} // Batch size for rendering
        windowSize={5} // Smaller render window for horizontal scrolling
        getItemLayout={(data, index) => ({
          length: screenWidth, // Adjust based on item width for horizontal scrolling
          offset: screenWidth * index, // Ensure offset matches item width
          index,
        })}
        
      />
  </View>
)}
      {mainTab === 'monthly' && (
      <ScrollView 
      style={styles.scrollViewContainer} 
      contentContainerStyle={styles.scrollViewContentContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
    <Calendar
      key={isDarkMode ? 'dark' : 'light'}
      current={new Date().toISOString().split('T')[0]}
      minDate={'2024-01-01'}
      maxDate={'2024-12-31'}
      onDayPress={handleDatePress}
      monthFormat={'MMMM yyyy'}
      hideExtraDays={false}
      style={[styles.calendarContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#ECEAFF' }]}
      theme={{
        calendarBackground: isDarkMode ? '#1A1A1A' : '#ECEAFF',
        textSectionTitleColor: isDarkMode ? '#FFFFFF' : '#000000',
        monthTextColor: isDarkMode ? '#FFFFFF' : '#000000',
        textMonthFontSize: 20,
        textMonthFontWeight: 'bold',
        arrowColor: isDarkMode ? '#FFFFFF' : '#000000',
        arrowStyle: {
          padding: 10,
        },
        'stylesheet.calendar.header': {
          arrow: {
            padding: 10,
          },
        }
      }}
      markedDates={{
        ...Object.keys(todos).reduce((acc, date) => {
          acc[date] = { 
            marked: true, 
            dotColor: '#7B61FF',
            activeOpacity: 0.7 
          };
          return acc;
        }, {}),
      }}
      dayComponent={dayComponent}
    />
  </ScrollView>
)}


      {mainTab === 'yearly' && (
        <View>
          <YearlyCalendar year={2025} isDarkMode={isDarkMode}/>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          resetForm();
          setModalVisible(false);
          setEditingTodoId(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Manage To-Do's for {selectedDate}</Text>

            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, modalTab === 'seller' && styles.selectedTab]}
                onPress={() => setModalTab('seller')}
              >
                <Text style={[styles.tabText, modalTab === 'seller' && styles.selectedTabText]}>Seller</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, modalTab === 'buyer' && styles.selectedTab]}
                onPress={() => setModalTab('buyer')}
              >
                <Text style={[styles.tabText, modalTab === 'buyer' && styles.selectedTabText]}>Buyer</Text>
              </TouchableOpacity>
            </View>

            {modalTab === 'seller' ? (
              // Seller tab content
              <>
                <TextInput
                  placeholder="Add or Edit To-Do"
                  value={newTodo}
                  onChangeText={setNewTodo}
                  style={styles.input}
                />
                
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={[styles.timeText,!time && { color: '#00000060' }]}>{time ? time.toLocaleTimeString() : "Set Time"}</Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={time || new Date()}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowTimePicker(false);
                      if (selectedDate) {
                        setTime(selectedDate);
                      }
                    }}
                  />
                )}

                
                {properties.length > 0 && (
                  <>
                    {console.log('Properties:', properties)}
                    <DropDownPicker
                      open={openProperty}
                      value={selectedProperty}
                      items={properties.map(property => ({
                        label: property.property_name,
                        value: property.id,
                      }))}
                      setOpen={setOpenProperty}
                      setValue={(value) => {
                        // Toggle selection
                        setSelectedProperty(value);
                      }}
                      setItems={setProperties}
                      searchable={true}
                      searchPlaceholder="Search for a property"
                      placeholderStyle={styles.placeholderStyle}
                      placeholder={selectedProperty ? selectedProperty.property_name : 'Select a Property'}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropDownContainer}
                      searchTextInputStyle={styles.searchTextInput}
                      searchContainerStyle={styles.searchContainer}

                    />
                  </>
                )}

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={editingTodoId !== null ? () => handleEditTodoSubmit(editingTodoId) : handleAddTodo}
                >
                  <Text style={styles.addButtonText}>
                    {editingTodoId !== null ? 'Edit To-Do' : 'Add To-Dos'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                    setSelectedProperty(null);
                    setValue(null);
                    setSelectedProperty(null);
                    setValue(null);
                    setEditingTodoId(null);
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>

                <View style={styles.todoListContainer}>
                  {renderTodosForDay(todos[selectedDate]?.filter(todo => !todo.buyer_id))}
                </View>
              </>
            ) : (
              // Buyer tab content
              <>
                <ScrollView style={{maxHeight: 200, marginBottom: 10}}>
                  <TextInput
                    placeholder="Add or Edit To-Do"
                    value={buyerTodoTitle}
                    onChangeText={setBuyerTodoTitle}
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={[styles.timeText,!time && { color: '#00000060' }]}>{time ? time.toLocaleTimeString() : "Set Time"}</Text>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <DateTimePicker
                      value={time || new Date()}
                      mode="time"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowTimePicker(false);
                        if (selectedDate) {
                          setTime(selectedDate);
                        }
                      }}
                    />
                  )}

                  {/* Toggle for buyer already exists */}
                  <View style={styles.toggleContainer}>
                    <Text>Existing Buyer?</Text>
                    <Switch
                      value={buyerAlreadyExists}
                      onValueChange={handleBuyerAlreadyExists}
                      trackColor={{ false: '#c0c0c0', true: '#7B61FF' }}
                      thumbColor={buyerAlreadyExists ? '#7B61FF' : '#7B61FF'}
                      ios_backgroundColor="#3e3e3e"
                    />
                  </View>

                  {!buyerAlreadyExists && (
                    <>
                      <TextInput
                        placeholder="Buyer Email"
                        value={buyerEmail}
                        onChangeText={setBuyerEmail}
                        style={styles.input}
                      />
                      <TextInput
                        placeholder="Buyer First Name"
                        value={buyerFirstName}
                        onChangeText={setBuyerFirstName}
                        style={styles.input}
                      />
                      <TextInput
                        placeholder="Buyer Last Name"
                        value={buyerLastName}
                        onChangeText={setBuyerLastName}
                        style={styles.input}
                      />
                      <TextInput
                        placeholder="Buyer Address"
                        value={buyerAddress}
                        onChangeText={setBuyerAddress}
                        style={styles.input}
                        multiline
                      />
                      <TextInput
                        placeholder="Buyer Phone Number"
                        value={buyerPhone}
                        onChangeText={setBuyerPhone}
                        style={styles.input}
                        keyboardType="phone-pad"
                      />
                    </>
                  )}
                </ScrollView>

                {buyerAlreadyExists && (
                    <DropDownPicker
                      style={[styles.dropdown, { marginBottom: 10, zIndex: 2000 }]}
                      open={openBuyer}
                      value={selectedBuyer}
                      items={buyerItems}
                      setOpen={setOpenBuyer}
                      setValue={setSelectedBuyer}
                      setItems={setBuyerItems}
                      placeholder="Select a buyer"
                      placeholderStyle={styles.placeholderStyle}
                      searchable={true}
                      searchPlaceholder="Search buyers"
                      dropDownContainerStyle={[styles.dropDownContainer, { zIndex: 2000 }]}
                      searchTextInputStyle={styles.searchTextInput}
                      searchContainerStyle={styles.searchContainer}
                      onChangeSearchText={(text) => {
                        fetchBuyerDataByEmail(text);
                      }}
                    />
                )}
                

                <DropDownPicker
                    mode="BADGE"
                    badgeDotColors={selectedBuyerProperties.map(id => {
                      const property = properties.find(prop => prop.id === id);
                      return property && property.pin_color ? property.pin_color : '#ff0000';
                    })}
                    multiple={true}
                    min={0}
                    max={10}
                    open={openBuyerProperties}
                    value={selectedBuyerProperties}
                    items={properties.map(property => ({
                      label: property.property_name,
                      value: property.id,
                    }))}
                    setOpen={setOpenBuyerProperties}
                    setValue={(value) => {
                      setSelectedBuyerProperties(value);
                    }}
                    setItems={setProperties}
                    searchable={true}
                    searchPlaceholder="Search for properties"
                    placeholder="Select Properties"
                    placeholderStyle={styles.placeholderStyle}
                    style={[styles.dropdown, { marginTop: 10, zIndex: 1000 }]}
                    searchTextInputStyle={styles.searchTextInput}
                    searchTextInputContainerStyle={styles.searchTextInputContainer}
                    searchContainerStyle={styles.searchContainer}
                    dropDownContainerStyle={[styles.dropDownContainer, { zIndex: 1000 }]}
                    selectedItemLabelStyle={styles.selectedItemLabel}
                    selectedItemContainerStyle={styles.selectedItemContainer}
                  />

                <DropDownPicker
                    mode="BADGE"
                    badgeDotColors={selectedBuyerProperties.map(id => {
                      const property = properties.find(prop => prop.id === id);
                      console.log('selectedBuyerPropertiesss', property); // Check the property object
                      return property && property.pin_color ? property.pin_color : '#7B61FF'; // Use property color or default
                    })}
                    multiple={true}
                    min={0}
                    max={10}
                    open={openBuyerProperties}
                    value={selectedBuyerProperties}
                    items={properties.map(property => ({
                      label: property.property_name,
                      value: property.id,
                    }))}
                    setOpen={setOpenBuyerProperties}
                    setValue={(value) => {
                      // Toggle selection
                      setSelectedBuyerProperties(value);
                    }}
                    setItems={setProperties}
                    searchable={true}
                    searchPlaceholder="Search for properties"
                    placeholder={selectedBuyerProperties.length > 0 
                      ? selectedBuyerProperties.map(id => {
                          const property = properties.find(prop => prop.id === id);
                          return property ? property.property_name : null;
                        }).join(', ') 
                      : "Select Buyer Properties"}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    selectedItemLabelStyle={styles.selectedItemLabel}
                    selectedItemContainerStyle={styles.selectedItemContainer}
                  />

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddBuyerTodo}
                >
                  <Text style={styles.addButtonText}>Add Buyer To-Do</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                    setEditingTodoId(null);
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>

                <View style={styles.todoListContainer}>
                  {renderTodosForDay(todos[selectedDate]?.filter(todo => todo.buyer_id))}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Time Conflict Modal */}
      <Modal
        visible={timeConflictModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTimeConflictModalVisible(false)}
      >
        <View style={styles.timeConflictModalContainer}>
          <View style={styles.timeConflictModalContent}>
            <Text style={styles.timeConflictModalTitle}>Time Conflict</Text>
            <Text style={styles.timeConflictModalMessage}>
              A todo already exists at this time. Would you like to choose a different time?
            </Text>
            
            <View style={styles.timeConflictButtonContainer}>
              <TouchableOpacity
                style={[styles.timeConflictButton, styles.timeConflictPrimaryButton]}
                onPress={() => {
                  setTimeConflictModalVisible(false);
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.timeConflictButtonText}>Choose Different Time</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.timeConflictButton, styles.timeConflictCancelButton]}
                onPress={() => setTimeConflictModalVisible(false)}
              >
                <Text style={[styles.timeConflictButtonText, styles.timeConflictCancelText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Conflict Modal */}
      <Modal
        visible={timeConflictModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTimeConflictModalVisible(false)}
      >
        <View style={styles.timeConflictModalContainer}>
          <View style={styles.timeConflictModalContent}>
            <Text style={styles.timeConflictModalTitle}>Time Conflict</Text>
            <Text style={styles.timeConflictModalMessage}>
              A todo already exists at this time. Would you like to choose a different time?
            </Text>
            
            <View style={styles.timeConflictButtonContainer}>
              <TouchableOpacity
                style={[styles.timeConflictButton, styles.timeConflictPrimaryButton]}
                onPress={() => {
                  setTimeConflictModalVisible(false);
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.timeConflictButtonText}>Choose Different Time</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.timeConflictButton, styles.timeConflictCancelButton]}
                onPress={() => setTimeConflictModalVisible(false)}
              >
                <Text style={[styles.timeConflictButtonText, styles.timeConflictCancelText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
