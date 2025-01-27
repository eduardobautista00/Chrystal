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
} from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';
import YearlyCalendar from '../YearlyCalendar'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker for time input
import styles from './styles';
import getEnvVars from '../../config/env';
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';


export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Set default to today
  const [todos, setTodos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mainTab, setMainTab] = useState('monthly'); // Default main tab set to monthly
  const [modalTab, setModalTab] = useState('seller'); // Default modal tab set to seller
  const { apiUrl } = getEnvVars();
  const dateColorMap = useRef({});
  const { authState } = useAuth();
  const flatListRef = useRef(null); // Initialize flatListRef
  const screenWidth = Dimensions.get('window').width;
  const [selectedHour, setSelectedHour] = useState(null);

  // New buyer todo form states
  const [buyerFirstName, setBuyerFirstName] = useState('test buyer');
  const [buyerLastName, setBuyerLastName] = useState('buyer test');
  const [buyerAddress, setBuyerAddress] = useState('test address');
  const [buyerPhone, setBuyerPhone] = useState('09276113969');
  const [selectedBuyerProperties, setSelectedBuyerProperties] = useState([]);
  const [buyerTodoTitle, setBuyerTodoTitle] = useState('Test Buyer');

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
          property => property.user_id === loggedInUserId
        );
  
        setProperties(userProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
  
    fetchProperties();
  }, [authState?.user?.id]); // Dependency to re-run if the user's ID changes
  

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
          title: newTodo,
          deadline: formattedDeadline,
          property_id: selectedProperty.id,
          agent_id: authState.user.id,
          for_buyer: false,
        };

        const response = await fetch(`${apiUrl}/update-todos/${todoId}`, {
          method: 'PUT',
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
          await fetchTodos();
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

  const handleAddTodo = async () => {
    if (newTodo && selectedDate && selectedProperty && time) {
      try {
        // Fetch agent data and match the agent ID with the user ID
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
  
        // Ensure the time is in HH:mm format
        const formattedTime =
          time instanceof Date
            ? time.toTimeString().slice(0, 5) // Extract HH:mm from Date object
            : time;
  
        // Combine selectedDate and formattedTime into the required format
        const formattedDeadline = `${selectedDate}T${formattedTime}`; // YYYY-MM-DDTHH:mm
  
        const todoData = {
          title: newTodo,
          deadline: formattedDeadline, // Pass correctly formatted deadline
          property_id: selectedProperty.id,
          agent_id: matchingAgent.id, // Use the matching agent's ID
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
  
          // Notification data (commented out)
          // const notificationData = {
          //   user_id: authState.user.id,
          //   title: newTodo,
          //   message: `Your todo for ${selectedProperty.property_name} is near its deadline.`,
          //   deadline: formattedDeadline,
          // };
  
          // console.log('Notification Request Data:', notificationData);
  
          // Create notification (commented out)
          // const notificationResponse = await fetch(`${apiUrl}/create-notifications`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Accept: 'application/json',
          //   },
          //   body: JSON.stringify(notificationData),
          // });
  
          // const notificationContentType = notificationResponse.headers.get('Content-Type');
          // if (
          //   notificationContentType &&
          //   notificationContentType.includes('application/json')
          // ) {
          //   const notificationResult = await notificationResponse.json();
  
          //   if (!notificationResponse.ok) {
          //     console.error('Notification API Error Response:', notificationResult);
          //     throw new Error(
          //       `Failed to create notification: ${notificationResult.message || 'Unknown error'}`
          //     );
          //   }
  
          //   console.log('Notification Response Data:', notificationResult);
          // } else {
          //   const rawNotificationResponse = await notificationResponse.text();
          //   console.error('Unexpected Notification Response:', rawNotificationResponse);
          //   throw new Error('Unexpected response format from server for notifications');
          // }
  
          // Success feedback
          Alert.alert('Success', 'To-Do Created Successfully');
          resetForm(); // Reset the form after adding the todo
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
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  
  const handleAddBuyerTodo = async () => {
    if (loading) {
      return; // Prevent multiple submissions while already loading
    }
  
    if (
      !buyerFirstName ||
      !buyerLastName ||
      !buyerPhone ||
      selectedBuyerProperties.length === 0 ||
      !buyerTodoTitle
    ) {
      Alert.alert('Error', 'Please fill in all required fields and select at least one property');
      return;
    }
  
    try {
      setLoading(true); // Set loading to true when starting the request
  
      // Fetch agent data and match the agent ID with the user ID
      const agentResponse = await fetch(`${apiUrl}/agents`);
      if (!agentResponse.ok) {
        throw new Error('Failed to fetch agents');
      }
      const agentData = await agentResponse.json();
  
      const matchingAgent = agentData.agents.find(agent => agent.user_id === authState.user.id);
      if (!matchingAgent) {
        throw new Error('Agent not found');
      }
  
      // Ensure the time is in HH:mm format
      const formattedTime = time instanceof Date
        ? time.toTimeString().slice(0, 5) // Extract HH:mm from Date object
        : time;
  
      // Combine selectedDate and formattedTime into the required format
      const formattedDeadline = `${selectedDate}T${formattedTime}`; // YYYY-MM-DDTHH:mm
      console.log('selected properties', selectedBuyerProperties);
  
      const todoData = {
        title: buyerTodoTitle,
        deadline: formattedDeadline, // Pass the correctly formatted deadline
        property_ids: selectedBuyerProperties, // Pass the selected properties as an array
        agent_id: matchingAgent.id, // Use the matching agent's ID
        for_buyer: true,
        buyer_first_name: buyerFirstName,
        buyer_last_name: buyerLastName,
        buyer_address: buyerAddress,
        buyer_phone_number: buyerPhone,
      };
  
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
        // Notification creation (commented out)
        // const notificationData = {
        //   user_id: authState.user.id,
        //   title: buyerTodoTitle,
        //   message: `Your To-Do for Mr/Ms. ${buyerFirstName} ${buyerLastName} is near its deadline.`,
        //   deadline: formattedDeadline,
        // };
  
        // const notificationResponse = await fetch(`${apiUrl}/create-notifications`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Accept: 'application/json',
        //   },
        //   body: JSON.stringify(notificationData),
        // });
  
        // if (!notificationResponse.ok) {
        //   console.error('Failed to create notification:', await notificationResponse.text());
        //   throw new Error('Notification creation failed');
        // }
  
        Alert.alert('Success', 'Buyer To-Do added successfully');
        // Reset buyer form
        resetForm();
        setModalVisible(false); // Close the modal
        await fetchTodos(); // Fetch todos again to reflect the newly added todo
      } else {
        Alert.alert('Error', data.message || 'Failed to add buyer to-do');
      }
    } catch (error) {
      console.error('Error adding buyer to-do:', error);
      Alert.alert('Error', 'An error occurred while adding the buyer to-do');
    } finally {
      setLoading(false); // Set loading to false when the request finishes
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
          { borderRadius: 0 }, // Rectangular day cell
          state === 'selected' ? { backgroundColor: '#7B61FF' } : { backgroundColor: '#ECEAFF' },
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
    setTime(new Date());
    setSelectedProperty(null);
    setBuyerFirstName('');
    setBuyerLastName('');
    setBuyerAddress('');
    setBuyerPhone('');
    setSelectedBuyerProperties([]);
    setBuyerTodoTitle('');
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
            <Text>{`Time: ${item.deadline_time}`}</Text>
            <Text>{`Property: ${item.property_name || 'None'}`}</Text>
            
            {/* Action buttons for each To-Do */}
            <View style={styles.actions}>
              <Button title="Edit" onPress={() => handleEditTodo(item.id)} />
              <Button title="Delete" color="red" onPress={() => handleDeleteTodo(item.id)} />
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
      <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
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
              <View style={styles.dateContainer}>
                  <Text style={styles.dateHeader}>{formattedDate.month}</Text>
                  <Text style={styles.dateHeader}>{formattedDate.weekday}</Text>
                  <Text
                      style={[
                          styles.dateHeader,
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
          <View key={hour} style={styles.gridRow}>
            <View style={styles.timeHeaderContainer}>
              <Text style={styles.timeHeader}>{hourString}</Text>
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


  return (
    <View style={styles.container}>
      <View style={styles.mainTabContainer}>
        <TouchableOpacity 
          style={[styles.tab, mainTab === 'daily' && styles.selectedTab]}
          onPress={() => setMainTab('daily')}
        >
          <Text style={[styles.tabText, mainTab === 'daily' && styles.selectedTabText]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mainTab === 'monthly' && styles.selectedTab]}
          onPress={() => setMainTab('monthly')}
        >
          <Text style={[styles.tabText, mainTab === 'monthly' && styles.selectedTabText]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, mainTab === 'yearly' && styles.selectedTab]}
          onPress={() => setMainTab('yearly')}
        >
          <Text style={[styles.tabText, mainTab === 'yearly' && styles.selectedTabText]}>Yearly</Text>
        </TouchableOpacity>
      </View>

      

      {mainTab === 'daily' && (
  <View style={{ flex: 1 }}>
    {loading ? ( // Show loading indicator if data is still loading
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : (
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
    )}
  </View>
)}



      {mainTab === 'monthly' && (
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          minDate={'2024-01-01'}
          maxDate={'2024-12-31'}
          onDayPress={handleDatePress}
          monthFormat={'MMMM yyyy'}
          hideExtraDays={false}
          style={styles.calendarContainer}
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
      )}

      {mainTab === 'yearly' && (
        <View>
          <YearlyCalendar year={2025} />
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
                  <Text>{time.toLocaleTimeString()}</Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setTime(selectedDate);
                      } else {
                        setTime(time);
                      }
                      setShowTimePicker(false);
                    }}
                  />
                )}

                <Text style={styles.label}>Select Property</Text>
                {properties.length > 0 && (
                  <Picker
                    selectedValue={selectedProperty?.id}
                    onValueChange={(itemValue) => {
                      if (itemValue !== selectedProperty?.id) {
                        const property = properties.find(p => p.id === itemValue);
                        if (property) {
                          setSelectedProperty(property);
                        }
                      }
                    }}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {properties.map((property, index) => (
                      <Picker.Item key={index} label={property.property_name} value={property.id} />
                    ))}
                  </Picker>
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
                <ScrollView style={{ height: 300, marginBottom: 10 }}>
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
                    <Text>{time.toLocaleTimeString()}</Text>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <DateTimePicker
                      value={time}
                      mode="time"
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setTime(selectedDate);
                        } else {
                          setTime(time);
                        }
                        setShowTimePicker(false);
                      }}
                    />
                  )}

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

                  <Text style={styles.label}>Select Properties</Text>
                  {properties.map((property) => (
                    <TouchableOpacity
                      key={property.id}
                      style={[
                        styles.propertyItem,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 10,
                          marginVertical: 5,
                        }
                      ]}
                      onPress={() => {
                        setSelectedBuyerProperties(prev => {
                          if (prev.includes(property.id)) {
                            return prev.filter(id => id !== property.id);
                          } else {
                            return [...prev, property.id];
                          }
                        });
                      }}
                    >
                      <View style={[
                        styles.checkbox,
                        {
                          width: 20,
                          height: 20,
                          borderWidth: 2,
                          borderColor: '#7B61FF',
                          marginRight: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }
                      ]}>
                        {selectedBuyerProperties.includes(property.id) && (
                          <View style={{
                            width: 12,
                            height: 12,
                            backgroundColor: '#7B61FF',
                          }} />
                        )}
                      </View>
                      <Text>{property.property_name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

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
    </View>
  );
}
