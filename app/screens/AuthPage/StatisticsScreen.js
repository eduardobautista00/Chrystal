import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import ProfileHeader from '../../components/ProfileHeader';
import StatsCard from '../../components/ProfileStatsCard';
import BackButton from '../../components/BackButton';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../../context/AuthContext';
import { Dimensions } from 'react-native';
import getEnvVars from '../../config/env';

const StatisticsScreen = ({ navigation }) => {
  const { authState } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [reportType, setReportType] = useState('sales');
  const [selectedreportType, setSelectedReportType] = useState('sales');
  const [selectedWeekRange, setSelectedWeekRange] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesData, setSalesData] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState(null); // New state for appointments data
  const [leadsData, setLeadsData] = useState(null);
  const [propertiesSoldData, setPropertiesSoldData] = useState(null);
  const [newListingsData, setNewListingsData] = useState(null);
  const [leadActivityData, setLeadActivityData] = useState(null);
  const [marketActivityData, setMarketActivityData] = useState(null);
  const [avesalesData, setAveSalesData] = useState(null);
  const [weekRanges, setWeekRanges] = useState([]);
  const [firstSaleDate, setFirstSaleDate] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const currentYear = new Date().getFullYear();
  const { apiUrl } = getEnvVars();

  const fetchAgentData = async () => {
    try {
      const response = await fetch(`${apiUrl}/agents`);
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      
      // Find the matching agent based on the logged-in user ID
      const matchingAgent = data.agents.find(agent => agent.user_id === authState.user.id);
      
      if (matchingAgent) {
        // Store the agent's data in state or use it accordingly
        const agentData = {
          firstName: matchingAgent.user?.first_name || 'N/A',
          lastName: matchingAgent.user?.last_name || 'N/A',
          company: matchingAgent.company?.company_name || 'N/A',
          address: matchingAgent.address || 'N/A',
          phone: matchingAgent.user?.phone_number || 'N/A',
          profileImage: matchingAgent.user?.profile_image || null,
        };
  
        setAgentData(agentData);  // Assuming you have a state setter `setAgentData` to store the data
      } else {
        console.error('No matching agent found for the logged-in user.');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const pollSalesData = async () => {
    try {
        const response = await fetch(`${apiUrl}/agents`);
        if (!response.ok) {
            throw new Error("Failed to fetch agents");
        }
        const data = await response.json();

        const matchingAgent = data.agents.find((agent) => agent.user_id === authState.user.id);
        if (matchingAgent) {
            const salesResponse = await fetch(`${apiUrl}/agent/${matchingAgent.id}/sold-properties`);
            if (!salesResponse.ok) {
                throw new Error("Failed to fetch sales data");
            }
            const salesData = await salesResponse.json();
            console.log("sale:", salesData);

            const processedSalesData = {
                daily: {},
                monthly: {}, // Monthly data now includes weekly and daily sales
                yearly: {},  // Yearly data with quarters
                totalSales: 0,
            };

            // Helper function to get the quarter
            const getQuarter = (month) => {
                if (month >= 0 && month <= 2) return "Q1";
                if (month >= 3 && month <= 5) return "Q2";
                if (month >= 6 && month <= 8) return "Q3";
                return "Q4"; // For months 9, 10, 11
            };

            // Helper function to get the week number in a month
            const getWeekNumber = (date) => {
                const day = date.getDate();
                return Math.ceil(day / 7); // Divide day of the month by 7 and round up
            };

            // Loop through all sold properties to process sales data
            salesData.sold_properties.forEach((property) => {
                const soldDate = new Date(property.sold_at);
                const dayLabel = soldDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const monthLabel = soldDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }); // Format: "Jan 2024"
                const yearLabel = soldDate.getFullYear(); // Get the year for yearly data
                const quarterLabel = getQuarter(soldDate.getMonth()); // Get the quarter
                const weekNumber = getWeekNumber(soldDate); // Get the week number
                const weekLabel = `Week ${weekNumber}`; // Label for week

                // Process daily sales data
                if (!processedSalesData.daily[dayLabel]) {
                    processedSalesData.daily[dayLabel] = 0;
                }
                processedSalesData.daily[dayLabel] += parseFloat(property.price);

                // Process monthly sales data (add weekly and daily sales)
                if (!processedSalesData.monthly[monthLabel]) {
                    processedSalesData.monthly[monthLabel] = { weekly: {}, daily: {}, total: 0 };
                }

                // Update daily sales in the current month's data
                if (!processedSalesData.monthly[monthLabel].daily[dayLabel]) {
                    processedSalesData.monthly[monthLabel].daily[dayLabel] = 0;
                }
                processedSalesData.monthly[monthLabel].daily[dayLabel] += parseFloat(property.price);

                // Update weekly sales inside the current month's data
                if (!processedSalesData.monthly[monthLabel].weekly[weekLabel]) {
                    processedSalesData.monthly[monthLabel].weekly[weekLabel] = 0;
                }
                processedSalesData.monthly[monthLabel].weekly[weekLabel] += parseFloat(property.price);

                // Update the monthly total sales
                processedSalesData.monthly[monthLabel].total += parseFloat(property.price);

                // Process yearly and quarterly sales data
                if (!processedSalesData.yearly[yearLabel]) {
                    processedSalesData.yearly[yearLabel] = {
                        Q1: 0,
                        Q2: 0,
                        Q3: 0,
                        Q4: 0,
                    };
                }
                processedSalesData.yearly[yearLabel][quarterLabel] += parseFloat(property.price);

                // Total sales
                processedSalesData.totalSales += parseFloat(property.price);
            });

            setSalesData(processedSalesData);
        }
    } catch (error) {
        console.error("Error fetching sales data:", error);
    }
};


const getWeekLabel = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const diffInDays = Math.floor((date - firstDayOfMonth) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffInDays / 7) + 1; // Start week count from 1
  return `Week ${weekNumber}`;
};


  
const pollAppointmentsData = async () => {
  try {
      const response = await fetch(`${apiUrl}/agents`);
      if (!response.ok) {
          throw new Error('Failed to fetch agents');
      }
      const data = await response.json();

      const matchingAgent = data.agents.find(agent => agent.user_id === authState.user.id);

      if (matchingAgent) {
          const appointmentsResponse = await fetch(`${apiUrl}/todos/agent/${matchingAgent.id}`);
          if (!appointmentsResponse.ok) {
              throw new Error('Failed to fetch appointments data');
          }
          const appointmentsData = await appointmentsResponse.json();
          const filteredAppointments = appointmentsData.todos.filter(todo => todo.buyer_id === null);

          const processedAppointments = {
              daily: {},
              monthly: {}, // Monthly data will now include weekly appointments
              totalAppointments: 0,
          };

          filteredAppointments.forEach((todo) => {
              const todoDate = new Date(todo.deadline);
              const dayLabel = todoDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const weekLabel = getWeekLabel(todoDate);
              const monthLabel = todoDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); // Format: "Jan 2025"

              // Process daily appointments data
              if (!processedAppointments.daily[dayLabel]) {
                  processedAppointments.daily[dayLabel] = 0;
              }
              processedAppointments.daily[dayLabel] += 1;

              // Process weekly appointments data (nested inside monthly)
              if (!processedAppointments.monthly[monthLabel]) {
                  processedAppointments.monthly[monthLabel] = { weekly: {}, total: 0 };
              }

              // Update weekly appointments inside the current month's data
              if (!processedAppointments.monthly[monthLabel].weekly[weekLabel]) {
                  processedAppointments.monthly[monthLabel].weekly[weekLabel] = 0;
              }
              processedAppointments.monthly[monthLabel].weekly[weekLabel] += 1;

              // Update the monthly total appointments
              processedAppointments.monthly[monthLabel].total += 1;

              // Total appointments
              processedAppointments.totalAppointments += 1;
          });

          setAppointmentsData(processedAppointments);
      }
  } catch (error) {
      console.error('Error fetching appointments data:', error);
      setAppointmentsData({ daily: {}, weekly: {}, monthly: {}, totalAppointments: 0 });
  }
};


  
const pollLeadsData = async () => {
  try {
      const response = await fetch(`${apiUrl}/agents`);
      if (!response.ok) {
          throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      console.log("agents", data);

      const matchingAgent = data.agents.find(agent => agent.user_id === authState.user.id);
      console.log("matching agent", matchingAgent);
      if (matchingAgent) {
          const leadsResponse = await fetch(`${apiUrl}/todos/agent/${matchingAgent.id}`);
          if (!leadsResponse.ok) {
              throw new Error('Failed to fetch leads data');
          }
          const leadsData = await leadsResponse.json();
          console.log("leads data", leadsData);

          const filteredLeads = leadsData.todos.filter(todo => todo.buyer_id !== null);

          const processedLeads = {
              daily: {},
              monthly: {}, // Monthly data will now include weekly leads
              totalLeads: 0,
          };

          filteredLeads.forEach((todo) => {
              const todoDate = new Date(todo.deadline);
              const dayLabel = todoDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const weekLabel = getWeekLabel(todoDate);
              const monthLabel = todoDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); // Format: "Jan 2025"

              // Process daily leads data
              if (!processedLeads.daily[dayLabel]) {
                  processedLeads.daily[dayLabel] = 0;
              }
              processedLeads.daily[dayLabel] += 1;

              // Process monthly leads data (include weekly leads inside monthly data)
              if (!processedLeads.monthly[monthLabel]) {
                  processedLeads.monthly[monthLabel] = { weekly: {}, total: 0 };
              }

              // Update weekly leads inside the current month's data
              if (!processedLeads.monthly[monthLabel].weekly[weekLabel]) {
                  processedLeads.monthly[monthLabel].weekly[weekLabel] = 0;
              }
              processedLeads.monthly[monthLabel].weekly[weekLabel] += 1;

              // Update the monthly total leads
              processedLeads.monthly[monthLabel].total += 1;

              // Total leads
              processedLeads.totalLeads += 1;
          });

          setLeadsData(processedLeads);
      }
  } catch (error) {
      console.error('Error fetching leads data:', error);
      setLeadsData({ daily: {}, monthly: {}, totalLeads: 0 });
  }
};



const pollPropertiesSoldData = async () => {
  try {
      const response = await fetch(`${apiUrl}/agents`);
      if (!response.ok) {
          throw new Error('Failed to fetch agents');
      }
      const data = await response.json();

      const matchingAgent = data.agents.find(agent => agent.user_id === authState.user.id);
      if (matchingAgent) {
          const propertiesResponse = await fetch(`${apiUrl}/agent/${matchingAgent.id}/sold-properties`);
          if (!propertiesResponse.ok) {
              throw new Error('Failed to fetch properties sold data');
          }
          const propertiesData = await propertiesResponse.json();
          console.log('properties sold:', propertiesData);  // Log the propertiesData to inspect the structure

          // Check if sold_properties is available and is an array
          if (!Array.isArray(propertiesData.sold_properties) || !propertiesData.sold_properties.length) {
              console.error('No sold properties data found.');
              return;
          }

          const processedPropertiesData = {
              monthly: {},  // Monthly data now includes weekly sales inside
              totalPropertiesSold: 0,
          };

          propertiesData.sold_properties.forEach((property) => {
              // Skip properties where sold_at is null or invalid
              const soldDate = new Date(property.sold_at);

              // Check if sold_at date is valid
              if (isNaN(soldDate)) {
                  console.error('Invalid sold_at date:', property.sold_at);
                  return;  // Skip if the date is invalid
              }

              const weekLabel = getWeekLabel(soldDate);  // Weekly label
              const monthLabel = soldDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });  // Monthly label (e.g., "Jan 2024")

              // Process monthly sales data (including weekly data inside each month)
              if (!processedPropertiesData.monthly[monthLabel]) {
                  processedPropertiesData.monthly[monthLabel] = { weekly: {}, total: 0 };
              }

              // Count weekly properties sold inside the current month's data
              if (!processedPropertiesData.monthly[monthLabel].weekly[weekLabel]) {
                  processedPropertiesData.monthly[monthLabel].weekly[weekLabel] = 0;
              }
              processedPropertiesData.monthly[monthLabel].weekly[weekLabel] += 1;  // Increment weekly properties sold

              // Update the monthly total properties sold
              processedPropertiesData.monthly[monthLabel].total += 1;

              // Total properties sold
              processedPropertiesData.totalPropertiesSold += 1;  // Increment total sold count
          });

          setPropertiesSoldData(processedPropertiesData); // Assuming you have a `setPropertiesSoldData` state setter
      }
  } catch (error) {
      console.error('Error fetching properties sold data:', error);
  }
};

const pollNewListingsData = async () => {
  try {
      // Fetching agents
      const agentsResponse = await fetch(`${apiUrl}/agents`);
      if (!agentsResponse.ok) {
          throw new Error('Failed to fetch agents');
      }
      const agentsData = await agentsResponse.json();

      // Find the matching agent based on the current user's ID
      const matchingAgent = agentsData.agents.find(agent => agent.user_id === authState.user.id);
      if (!matchingAgent) {
          console.error('No matching agent found.');
          return;  // If no matching agent is found, return early
      }

      // Fetch new listings for the matching agent
      const listingsResponse = await fetch(`${apiUrl}/properties`);
      if (!listingsResponse.ok) {
          throw new Error('Failed to fetch new listings');
      }
      const listingsData = await listingsResponse.json();
      console.log('new listings:', listingsData);  // Log the new listings data to inspect the structure

      // Check if the property key is available and is an array
      if (!Array.isArray(listingsData.property) || !listingsData.property.length) {
          console.error('No new listings data found.');
          return;
      }

      const processedNewListingsData = {
          monthly: {},  // Monthly data includes weekly listings inside
          totalNewListings: 0,
      };

      listingsData.property.forEach((property) => {
          // Skip properties where created_at is null or invalid
          const createdDate = new Date(property.created_at);

          // Check if created_at date is valid
          if (isNaN(createdDate)) {
              console.error('Invalid created_at date:', property.created_at);
              return;  // Skip if the date is invalid
          }

          const weekLabel = getWeekLabel(createdDate);  // Weekly label
          const monthLabel = createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });  // Monthly label (e.g., "Jan 2025")

          // Process monthly new listings data (including weekly listings inside each month)
          if (!processedNewListingsData.monthly[monthLabel]) {
              processedNewListingsData.monthly[monthLabel] = { weekly: {}, total: 0 };
          }

          // Count weekly new listings inside the current month's data
          if (!processedNewListingsData.monthly[monthLabel].weekly[weekLabel]) {
              processedNewListingsData.monthly[monthLabel].weekly[weekLabel] = 0;
          }
          processedNewListingsData.monthly[monthLabel].weekly[weekLabel] += 1;  // Increment weekly new listings

          // Update the monthly total new listings
          processedNewListingsData.monthly[monthLabel].total += 1;

          // Total new listings
          processedNewListingsData.totalNewListings += 1;  // Increment total listings count
      });

      setNewListingsData(processedNewListingsData); // Assuming you have a `setNewListingsData` state setter
  } catch (error) {
      console.error('Error fetching new listings data:', error);
  }
};


const pollLeadActivityData = async () => {
  try {
    const agentsResponse = await fetch(`${apiUrl}/agents`);
    if (!agentsResponse.ok) {
      throw new Error("Failed to fetch agents");
    }
    const agentsData = await agentsResponse.json();

    const matchingAgent = agentsData.agents.find(agent => agent.user_id === authState.user.id);
    if (!matchingAgent) {
      console.error("No matching agent found.");
      return;
    }

    const todosResponse = await fetch(`${apiUrl}/todos/agent/${matchingAgent.id}`);
    if (!todosResponse.ok) {
      throw new Error("Failed to fetch todos data");
    }
    const todosData = await todosResponse.json();

    if (!Array.isArray(todosData.todos) || todosData.todos.length === 0) {
      //console.error("No todos data found.");
      return;
    }

    // Initialize the processed data structure
    const processedLeadActivityData = {
      monthly: {},
      yearly: {},
    };

    todosData.todos.forEach((todo) => {
      // Ensure valid date format
      const createdDate = new Date(todo.created_at);
      if (isNaN(createdDate)) {
        console.error("Invalid created_at date:", todo.created_at);
        return;
      }

      // Format the date as 'Month Year' and 'Year' using a supported locale
      const monthLabel = createdDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const yearLabel = createdDate.getFullYear().toString();

      // Check if the current month exists in the processed data; initialize if not
      if (!processedLeadActivityData.monthly[monthLabel]) {
        processedLeadActivityData.monthly[monthLabel] = { leads: 0, appointments: 0 };
      }

      // Check if the current year exists in the processed data; initialize if not
      if (!processedLeadActivityData.yearly[yearLabel]) {
        processedLeadActivityData.yearly[yearLabel] = { leads: 0, appointments: 0 };
      }

      // Increment counts based on the type of todo
      if (todo.buyer_id !== null) {
        // Count as a lead
        processedLeadActivityData.monthly[monthLabel].leads += 1;
        processedLeadActivityData.yearly[yearLabel].leads += 1;
      } else {
        // Count as an appointment
        processedLeadActivityData.monthly[monthLabel].appointments += 1;
        processedLeadActivityData.yearly[yearLabel].appointments += 1;
      }
    });

    console.log("Processed Lead Activity Data:", processedLeadActivityData);
    setLeadActivityData(processedLeadActivityData); // Set the data in state
  } catch (error) {
    console.error("Error fetching lead and appointment activity data:", error);
  }
};



const pollMarketActivityData = async () => {
  try {
    // Fetch agent data
    const agentsResponse = await fetch(`${apiUrl}/agents`);
    if (!agentsResponse.ok) {
      throw new Error("Failed to fetch agents");
    }
    const agentsData = await agentsResponse.json();

    // Find the matching agent based on the current user's ID
    const matchingAgent = agentsData.agents.find(agent => agent.user_id === authState.user.id);
    if (!matchingAgent) {
      console.error("No matching agent found.");
      return;
    }

    // Fetch sold properties data for the matching agent
    const soldPropertiesResponse = await fetch(`${apiUrl}/agent/${matchingAgent.id}/sold-properties`);
    if (!soldPropertiesResponse.ok) {
      throw new Error("Failed to fetch sold properties data");
    }
    const soldPropertiesData = await soldPropertiesResponse.json();

    // Fetch new listings data
    const listingsResponse = await fetch(`${apiUrl}/properties`);
    if (!listingsResponse.ok) {
      throw new Error("Failed to fetch properties data");
    }
    const listingsData = await listingsResponse.json();

    // Check for valid data
    if (
      !Array.isArray(soldPropertiesData.sold_properties) ||
      !Array.isArray(listingsData.property) ||
      (soldPropertiesData.sold_properties.length === 0 && listingsData.property.length === 0)
    ) {
      console.error("No market activity data found.");
      return;
    }

    // Initialize the processed data structure
    const processedMarketActivityData = {
      monthly: {},
      yearly: {},
    };

    // Process sold properties data
    soldPropertiesData.sold_properties.forEach((property) => {
      const soldDate = new Date(property.sold_at);
      if (isNaN(soldDate)) {
        console.error("Invalid sold_at date:", property.sold_at);
        return;
      }

      const monthLabel = soldDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const yearLabel = soldDate.getFullYear().toString();

      if (!processedMarketActivityData.monthly[monthLabel]) {
        processedMarketActivityData.monthly[monthLabel] = { sold: 0, listings: 0 };
      }
      if (!processedMarketActivityData.yearly[yearLabel]) {
        processedMarketActivityData.yearly[yearLabel] = { sold: 0, listings: 0 };
      }

      processedMarketActivityData.monthly[monthLabel].sold += 1;
      processedMarketActivityData.yearly[yearLabel].sold += 1;
    });

    // Process listings data
    listingsData.property.forEach((property) => {
      const createdDate = new Date(property.created_at);
      if (isNaN(createdDate)) {
        console.error("Invalid created_at date:", property.created_at);
        return;
      }

      const monthLabel = createdDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const yearLabel = createdDate.getFullYear().toString();

      if (!processedMarketActivityData.monthly[monthLabel]) {
        processedMarketActivityData.monthly[monthLabel] = { sold: 0, listings: 0 };
      }
      if (!processedMarketActivityData.yearly[yearLabel]) {
        processedMarketActivityData.yearly[yearLabel] = { sold: 0, listings: 0 };
      }

      processedMarketActivityData.monthly[monthLabel].listings += 1;
      processedMarketActivityData.yearly[yearLabel].listings += 1;
    });

    console.log("Processed Market Activity Data:", processedMarketActivityData);
    setMarketActivityData(processedMarketActivityData); // Set the data in state
  } catch (error) {
    console.error("Error fetching market activity data:", error);
  }
};

const pollAveSalesData = async () => {
  try {
      const response = await fetch(`${apiUrl}/agents`);
      if (!response.ok) {
          throw new Error('Failed to fetch agents');
      }
      const data = await response.json();

      const matchingAgent = data.agents.find(agent => agent.user_id === authState.user.id);
      if (matchingAgent) {
          const avesalesResponse = await fetch(`${apiUrl}/agent/${matchingAgent.id}/sold-properties`);
          if (!avesalesResponse.ok) {
              throw new Error('Failed to fetch sales data');
          }
          const avesalesData = await avesalesResponse.json();
          console.log("sale:", avesalesData);

          const processedAveSalesData = {
              daily: {},
              monthly: {}, // Monthly data with weekly sales and average
              yearly: {}, // Yearly data with quarters and average
          };

          // Helper function to get the quarter
          const getQuarter = (month) => {
              if (month >= 0 && month <= 2) return 'Q1';
              if (month >= 3 && month <= 5) return 'Q2';
              if (month >= 6 && month <= 8) return 'Q3';
              return 'Q4'; // For months 9, 10, 11
          };

          // Loop through all sold properties to process sales data
          avesalesData.sold_properties.forEach((property) => {
              const soldDate = new Date(property.sold_at);
              const dayLabel = soldDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const weekLabel = getWeekLabel(soldDate);
              const monthLabel = soldDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); // Format: "Jan 2024"
              const yearLabel = soldDate.getFullYear(); // Get the year for yearly data
              const quarterLabel = getQuarter(soldDate.getMonth()); // Get the quarter

              // Process daily sales data
              if (!processedAveSalesData.daily[dayLabel]) {
                processedAveSalesData.daily[dayLabel] = 0;
              }
              processedAveSalesData.daily[dayLabel] += parseFloat(property.price);

              // Process monthly sales data (include weekly sales inside monthly data)
              if (!processedAveSalesData.monthly[monthLabel]) {
                processedAveSalesData.monthly[monthLabel] = { weekly: {}, total: 0, count: 0, average: 0 };
              }

              // Update weekly sales inside the current month's data
              if (!processedAveSalesData.monthly[monthLabel].weekly[weekLabel]) {
                processedAveSalesData.monthly[monthLabel].weekly[weekLabel] = 0;
              }
              processedAveSalesData.monthly[monthLabel].weekly[weekLabel] += parseFloat(property.price);

              // Update the monthly total sales and count
              processedAveSalesData.monthly[monthLabel].total += parseFloat(property.price);
              processedAveSalesData.monthly[monthLabel].count += 1;

              // Process yearly and quarterly sales data
              if (!processedAveSalesData.yearly[yearLabel]) {
                processedAveSalesData.yearly[yearLabel] = {
                      Q1: { total: 0, count: 0, average: 0 },
                      Q2: { total: 0, count: 0, average: 0 },
                      Q3: { total: 0, count: 0, average: 0 },
                      Q4: { total: 0, count: 0, average: 0 },
                      total: 0,
                      count: 0,
                      average: 0,
                  };
              }

              // Update quarterly and yearly totals and counts
              processedAveSalesData.yearly[yearLabel][quarterLabel].total += parseFloat(property.price);
              processedAveSalesData.yearly[yearLabel][quarterLabel].count += 1;
              processedAveSalesData.yearly[yearLabel].total += parseFloat(property.price);
              processedAveSalesData.yearly[yearLabel].count += 1;
          });

          // Calculate average sales per month
          Object.keys(processedAveSalesData.monthly).forEach(monthLabel => {
              const monthData = processedAveSalesData.monthly[monthLabel];
              monthData.average = monthData.total / monthData.count; // Average sales per month based on sold properties
          });

          // Calculate average sales per quarter and year
          Object.keys(processedAveSalesData.yearly).forEach(yearLabel => {
              const yearData = processedAveSalesData.yearly[yearLabel];
              ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
                  const quarterData = yearData[quarter];
                  if (quarterData.count > 0) {
                      quarterData.average = quarterData.total / quarterData.count; // Average for the quarter
                  }
              });
              if (yearData.count > 0) {
                  yearData.average = yearData.total / yearData.count; // Average for the year
              }
          });

          setAveSalesData(processedAveSalesData);
      }
  } catch (error) {
      console.error('Error fetching sales data:', error);
  }
};


  const startPolling = () => {
    pollSalesData(); // Call initially to fetch data
    pollAppointmentsData(); // Call initially to fetch data
    pollLeadsData(); // Call initially to fetch data
    pollPropertiesSoldData();
    pollNewListingsData();
    pollLeadActivityData();
    pollMarketActivityData();
    pollAveSalesData();
  
    // Set up polling to fetch data every 30 seconds
    const salesInterval = setInterval(pollSalesData, 30000);
    const appointmentsInterval = setInterval(pollAppointmentsData, 30000);
    const leadsInterval = setInterval(pollLeadsData, 30000);
    const soldInterval = setInterval(pollPropertiesSoldData, 30000);
    const listingsInterval = setInterval(pollNewListingsData, 30000);
    const leadActivityInterval = setInterval(pollLeadActivityData, 30000);
    const marketActivityInterval = setInterval(pollMarketActivityData, 30000);
    const aveSalesInterval = setInterval(pollAveSalesData, 30000);
  
    return () => {
      // Clear the intervals when no longer needed, e.g., when the component unmounts
      clearInterval(salesInterval);
      clearInterval(appointmentsInterval);
      clearInterval(leadsInterval);
      clearInterval(soldInterval);
      clearInterval(listingsInterval);
      clearInterval(leadActivityInterval);
      clearInterval(marketActivityInterval);
      clearInterval(aveSalesInterval);
    };
  };
  
  useEffect(() => {
    const stopPolling = startPolling();
  
    return () => {
      stopPolling(); // Clean up intervals when the component is unmounted
    };
  }, []);
  
  const generateWeekRanges = () => {
    const ranges = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    // Start from the 1st of the current month
    let firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  
    // Adjust to the previous Sunday (ensuring not to go back too far)
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
    if (dayOfWeek !== 0) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - dayOfWeek);
    }
  
    // Generate ranges until the end of the current month
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0); // Last day of the month
    let currentWeekStart = new Date(firstDayOfMonth);
  
    while (currentWeekStart <= endOfMonth || currentWeekStart.getDay() !== 0) {
      const weekStart = new Date(currentWeekStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
  
      // Format start and end labels
      const startDay = weekStart.getDate();
      const endDay = weekEnd.getDate();
      const monthLabelStart = weekStart.toLocaleDateString('en-US', { month: 'short' });
      const monthLabelEnd =
        weekEnd.getMonth() !== weekStart.getMonth()
          ? weekEnd.toLocaleDateString('en-US', { month: 'short' })
          : monthLabelStart;
  
      ranges.push({
        label: `${monthLabelStart} ${startDay} - ${monthLabelEnd} ${endDay}`,
        value: ranges.length + 1,
        startDate: weekStart,
        endDate: weekEnd,
      });
  
      // Move to the next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
  
    return ranges;
  };

  useEffect(() => {
    const ranges = generateWeekRanges();
    setWeekRanges(ranges);
  }, []);
  
  

  const handleWeekRangeChange = (value) => {
    setSelectedWeekRange(value);
};

const renderWeeklyPieChart = () => {
  console.log("Selected Report  :", selectedreportType);
  console.log("Selected Month   :", selectedMonth);

  // Determine the data source based on selected report type
  const selectedData = {
    sales: salesData,
    appointments: appointmentsData,
    leads: leadsData,
    sold: propertiesSoldData,
    listings: newListingsData,
  }[selectedreportType];

  // Check if selectedData is defined and contains the monthly data
  if (!selectedData || !selectedData.monthly) {
    console.log("No Monthly Data Available");
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>No Data Available</Text>
      </View>
    );
  }

  console.log("Selected Data:", selectedData);
  console.log("Monthly Data upper:", selectedData.monthly);

  // Convert the selected month (number) to a readable month string (e.g., "Jan 2025")
  const monthLabel = new Date(2025, selectedMonth - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
  const monthLabelText = new Date(2025, selectedMonth - 1).toLocaleString('default', { month: 'long' });

  console.log("Formatted Month Label:", monthLabel);

  // Check if the selectedMonth exists within the monthly data
  const monthlyData = selectedData.monthly[monthLabel];
  if (!monthlyData) {
    console.log(`No data for selected month: ${monthLabelText}`);
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>
          No Data Available for {monthLabelText}
        </Text>
      </View>
    );
  }

  console.log("Monthly Data:", monthlyData);

  // Check if weekly data exists within the selected month
  if (!monthlyData.weekly) {
    console.log("No weekly data for the selected month");
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>
          No Weekly Data Available for {monthLabel}
        </Text>
      </View>
    );
  }

  console.log("Weekly Data Structure (filtered):", monthlyData.weekly);

  // Dynamically fetch all available weeks from the weekly data
  const weeklyEntries = Object.entries(monthlyData.weekly);

  // Prepare the weekly data
  const filteredWeeklyData = weeklyEntries.map(([weekLabel, amount]) => ({
    weekLabel,
    amount,
  }));

  console.log("Filtered Weekly Data:", filteredWeeklyData);

  // Calculate the total amount to show absolute values
  const totalAmount = filteredWeeklyData.reduce((total, data) => total + data.amount, 0);

  // Create pie chart data with labels for absolute values
  const modifiedPieData = filteredWeeklyData.map((data, index) => ({
    ...data,
    name: data.weekLabel,
    label: data.amount > 0 ? `${data.amount.toLocaleString()}` : "", // Add absolute value label
    color: ["#FF6347", "#98FB98", "#87CEFA", "#FFD700", "#FFA07A"][index % 5],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  // Handle cases where all weekly data is zero
  if (modifiedPieData.every((item) => item.amount === 0)) {
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>
          No Weekly Data Available for the Selected Month
        </Text>
      </View>
    );
  }

  // Render the pie chart with absolute value labels
  return (
    <PieChart
      data={modifiedPieData}
      width={Dimensions.get("window").width - 40}
      height={250}
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }}
      accessor="amount"
      backgroundColor="transparent"
      paddingLeft={15}
    />
  );
};



const renderMonthlyChart = () => {
  console.log("Selected Year:", selectedYear);
  console.log("Selected Report:", selectedreportType);

  const selectedDataMonthly = {
    leadActivity: leadActivityData,
    marketActivity: marketActivityData,
    sales: salesData,
    aveSalePrice: avesalesData,
  }[selectedreportType];

  console.log('Data :', selectedDataMonthly);

  // Check if selected data and its monthly data exist
  if (!selectedDataMonthly || !selectedDataMonthly.monthly) {
    console.log("No Monthly Data Available");
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>No Data Available</Text>
      </View>
    );
  }

  // Labels for months from January to December
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Extract the monthly data for the selected year
  const monthlyData = selectedDataMonthly.monthly;

  // Initialize datasets
  let dataset1 = [];
  let dataset2 = [];
  let legend = [];
  let dataset1Color = "";
  let dataset2Color = "";

  if (selectedreportType === "leadActivity") {
    dataset1 = monthLabels.map((month) => {
      const monthYearKey = `${month} ${selectedYear}`;
      return monthlyData[monthYearKey] ? monthlyData[monthYearKey].leads : null; // Use null if no data
    });

    dataset2 = monthLabels.map((month) => {
      const monthYearKey = `${month} ${selectedYear}`;
      return monthlyData[monthYearKey] ? monthlyData[monthYearKey].appointments : null; // Use null if no data
    });

    legend = ["New Leads", "Appointments"];
    dataset1Color = "rgba(75, 192, 192, 1)"; // Blue
    dataset2Color = "rgba(153, 102, 255, 1)"; // Red
  } else if (selectedreportType === "marketActivity") {
    dataset1 = monthLabels.map((month) => {
      const monthYearKey = `${month} ${selectedYear}`;
      return monthlyData[monthYearKey] ? monthlyData[monthYearKey].sold : null; // Use null if no data
    });

    dataset2 = monthLabels.map((month) => {
      const monthYearKey = `${month} ${selectedYear}`;
      return monthlyData[monthYearKey] ? monthlyData[monthYearKey].listings : null; // Use null if no data
    });

    legend = ["Properties Sold", "New Listings"];
    dataset1Color = "rgba(75, 192, 192, 1)"; // Green
    dataset2Color = "rgba(153, 102, 255, 1)"; // Purple
  } else if (selectedreportType === "sales") {
    // Handle sales with BarChart
    dataset1 = monthLabels.map((month) => {
        const monthYearKey = `${month} ${selectedYear}`;
        return monthlyData[monthYearKey] ? monthlyData[monthYearKey].total : null; // Use null if no data
    });

    legend = ["Total Sales"];
    dataset1Color = "rgba(75, 192, 192, 1)"; // Blue for Total Sales
  } else if (selectedreportType === "aveSalePrice") {
      // Handle aveSalePrice with BarChart
      dataset1 = monthLabels.map((month) => {
          const monthYearKey = `${month} ${selectedYear}`;
          return monthlyData[monthYearKey] ? monthlyData[monthYearKey].average : null; // Use null if no data
      });

      legend = ["Average Sale Price"];
      dataset1Color = "rgba(75, 192, 192, 1)"; // Blue for Average Sale Price
  }else {
    console.log("Invalid Report Type");
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>Invalid Report Type</Text>
      </View>
    );
  }
  // Filter out null data for both datasets, keeping the corresponding months
  const filteredDataset1 = dataset1.filter(value => value !== null); // Keep only non-null data for dataset1
  const filteredDataset2 = dataset2.filter(value => value !== null); // Keep only non-null data for dataset2
  const filteredLabels = monthLabels.filter((_, index) => dataset1[index] !== null || dataset2[index] !== null); // Keep only months with data

  // Check if both datasets are empty for the selected year
  if (filteredDataset1.length === 0 && filteredDataset2.length === 0) {
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>
        No Data Available for {selectedMonth}
        </Text>
      </View>
    );
  }

  // Conditional rendering for BarChart or LineChart
  if (selectedreportType === "sales" || selectedreportType === "aveSalePrice") {
    return (
      <BarChart
        data={{
          labels: monthLabels,
          datasets: [
            {
              data: dataset1.map(value => Math.round(value)), // Round values to the nearest integer
              label: selectedreportType.charAt(0).toUpperCase() + selectedreportType.slice(1), // Capitalize the label
              color: (opacity = 1) => dataset1Color.replace("1", opacity),
            },
          ],
        }}
        width={Dimensions.get("window").width - 0}
        height={320}
        chartConfig={barChartConfig}
        style={[styles.chart, { marginLeft: -75}]}
        verticalLabelRotation={-45}
        showValuesOnTopOfBars={true}
        fromZero={true}
      />
    );
  } else {
    return (
      <LineChart
        data={{
          labels: monthLabels, // Show only months with data
          datasets: [
            {
              data: dataset1, // Use filtered dataset for line chart
              color: (opacity = 1) => dataset1Color.replace("1", opacity),
              strokeWidth: 5,
              propsForDots: {
                r: 0, // No dots for the dataset if there's no data
                strokeWidth: "2",
                stroke: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                fill: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              },
            },
            {
              data: dataset2, // Use filtered dataset for line chart
              color: (opacity = 1) => dataset2Color.replace("1", opacity),
              strokeWidth: 5,
              propsForDots: {
                r: 0, // No dots for the dataset if there's no data
                strokeWidth: "2",
                stroke: (opacity = 1) => dataset2Color.replace("1", opacity),
                fill: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              },
            },
          ],
          legend,
        }}
        width={Dimensions.get("window").width - 0}
        height={270}
        chartConfig={{
          backgroundColor: "#ECEAFF",
          backgroundGradientFrom: "#ECEAFF",
          backgroundGradientTo: "#ECEAFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier={false}
        style={[styles.chart, { marginLeft: -75 }]}
        withShadow={false}
        verticalLabelRotation={-45}
      />
    );
  }
};

// Function for rendering yearly chart
const renderYearlyChart = () => {
  console.log("Selected Year:", selectedYear);
  console.log("Selected Report:", selectedreportType);

  // Map the selected report type to the corresponding data
  const selectedDataYearly = {
    leadActivity: leadActivityData,
    marketActivity: marketActivityData,
    sales: salesData,
    aveSalePrice: avesalesData,
  }[selectedreportType];

  console.log("Data:", selectedDataYearly);

  // Check if selected data and its yearly data exist
  if (!selectedDataYearly || !selectedDataYearly.yearly) {
    console.log("No Yearly Data Available");
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>No Data Available</Text>
      </View>
    );
  }

  // Extract the yearly data
  const yearlyData = selectedDataYearly.yearly;

  // Check if there is data for the selected year
  if (!yearlyData[selectedYear]) {
    console.log("No Data for Selected Year");
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>No Data Available for {selectedYear}</Text>
      </View>
    );
  }

  // Generate year labels dynamically for the past 5 years including the current year
  const getYearLabels = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => (currentYear - i).toString()).reverse();
  };

  // Labels for years (use years present in the data dynamically)
  const yearLabels = getYearLabels();

  if (selectedreportType === "leadActivity" || selectedreportType === "marketActivity") {
    // Line Chart Logic for Lead Activity and Market Activity
    let dataset1 = [];
    let dataset2 = [];
    let legend = [];
    let dataset1Color = "";
    let dataset2Color = "";

    if (selectedreportType === "leadActivity") {
      dataset1 = yearLabels.map((year) => yearlyData[year]?.leads || null);
      dataset2 = yearLabels.map((year) => yearlyData[year]?.appointments || null);

      legend = ["New Leads", "Appointments"];
      dataset1Color = "rgba(75, 192, 192, 1)"; // Blue
      dataset2Color = "rgba(153, 102, 255, 1)"; // Purple
    } else if (selectedreportType === "marketActivity") {
      dataset1 = yearLabels.map((year) => yearlyData[year]?.sold || null);
      dataset2 = yearLabels.map((year) => yearlyData[year]?.listings || null);

      legend = ["Properties Sold", "New Listings"];
      dataset1Color = "rgba(75, 192, 192, 1)"; // Green
      dataset2Color = "rgba(153, 102, 255, 1)"; // Purple
    }

    // Filter out null data for both datasets
    const filteredDataset1 = dataset1.filter(value => value !== null);
    const filteredDataset2 = dataset2.filter(value => value !== null);

    return (
      <LineChart
        data={{
          labels: yearLabels,
          datasets: [
            {
              data: dataset1,
              label: legend[0],
              color: (opacity = 1) => dataset1Color.replace("1", opacity),
            },
            {
              data: dataset2,
              label: legend[1],
              color: (opacity = 1) => dataset2Color.replace("1", opacity),
            },
          ],
          legend
        }}
        width={Dimensions.get("window").width - 0}
        height={270}
        chartConfig={{
          backgroundColor: "#ECEAFF",
          backgroundGradientFrom: "#ECEAFF",
          backgroundGradientTo: "#ECEAFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={[styles.chart, { marginLeft: -75 }]}
        bezier
        verticalLabelRotation={-45}
        withShadow={false}
      />
    );
  } else if (selectedreportType === "sales" || selectedreportType === "aveSalePrice") {
    let dataset1 = [];
    let legend = [];
    let dataset1Color = "rgba(75, 192, 192, 1)"; // Blue for sales or aveSalePrice

    if (selectedreportType === "sales") {
        dataset1 = ["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
            // For sales, only show total sales data for the selected year
            return yearlyData[selectedYear]?.[quarter] || 0; // Get total sales for each quarter
        });
        legend = [
            "Q1 (Jan. - Mar.)", 
            "Q2 (Apr. - Jun.)", 
            "Q3 (Jul. - Sep.)", 
            "Q4 (Oct. - Dec.)", 
        ];
    } else if (selectedreportType === "aveSalePrice") {
        dataset1 = ["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
            // For average sale price, get the average sale price for each quarter
            return Math.round(yearlyData[selectedYear]?.[quarter]?.average || 0);
        });
        legend = [
            "Q1 (Jan. - Mar.)", 
            "Q2 (Apr. - Jun.)", 
            "Q3 (Jul. - Sep.)", 
            "Q4 (Oct. - Dec.)", 
        ];
    }


    
    // Prepare data for PieChart (use only selected year data)
    const pieData = dataset1.map((value, index) => ({
      name: legend[index], // Use only the label for the name
      value: value, // Data value for the pie chart
      color: ["#FF6347", "#98FB98", "#87CEFA", "#FFD700", "#FFA07A"][index % 5],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));

    console.log("Dataset:", dataset1);
    console.log("Legend:", legend);
    console.log("PieData:", pieData);

    // Modify the pieData to include absolute value labels
    const modifiedPieData = pieData.map((item) => ({
      ...item,
      label: item.value > 0 ? `$${item.value.toLocaleString()}` : "", // Add value inside the pie chart if it's greater than 0
    }));

    return (
      <View style={{ alignItems: "center" }}>
        <PieChart
          data={modifiedPieData}
          width={Dimensions.get("window").width - 40}
          height={250}
          chartConfig={{
            backgroundColor: "#ECEAFF",
            backgroundGradientFrom: "#ECEAFF",
            backgroundGradientTo: "#ECEAFF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
    );
  } else {
    console.log("Invalid Report Type");
    return (
      <View style={[styles.emptyChart]}>
        <Text style={styles.emptyChartText}>Invalid Report Type</Text>
      </View>
    );
  }
};




// Helper function to generate random colors for Pie Chart
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

  const barChartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    fillShadowGradient: '#7B61FF',
    fillShadowGradientOpacity: 1,
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    barPercentage: 0.5,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(123, 97, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForVerticalLabels: {
      fontSize: 10,
      fill: '#000'
    },
    propsForHorizontalLabels: {
      fontSize: 8,
      fill: '#000',
      rotation: -45
    },
    style: {
      borderRadius: 16
    },
  };

  const renderChart = () => {
    if (selectedPeriod === 'day') {
      // Get the selected week range from `weekRanges`
      const selectedRange = weekRanges.find((range) => range.value === selectedWeekRange);
    
      // Generate days for the selected week range
      const daysInWeek = selectedRange
        ? Array.from({ length: 7 }, (_, i) => {
            const date = new Date(selectedRange.startDate);
            date.setDate(date.getDate() + i);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          })
        : []; // Fallback if no range is selected
    
         // Map daily data based on the selected metric
        const metricData = daysInWeek.map((day) => {
          if (selectedreportType === 'sales') {
            return salesData?.daily?.[day] || 0;
          } else if (selectedreportType === 'appointments') {
            return appointmentsData?.daily?.[day] || 0;
          } else if (selectedreportType === 'leads') {
            return leadsData?.daily?.[day] || 0;
          }
          return 0;
        });

      // Map daily sales data to the days in the selected week
      const dailyData = daysInWeek.map((day) => salesData?.daily?.[day] || 0);
      const dailyAppointmentsData = daysInWeek.map((day) => appointmentsData?.daily?.[day] || 0); // Map daily appointments data
    
      return (
        <BarChart
        data={{
          labels: daysInWeek,
          datasets: [
            {
              data: metricData,
              label: selectedreportType.charAt(0).toUpperCase() + selectedreportType.slice(1), // Capitalize the label
            },
          ],
        }}
          width={Dimensions.get('window').width}
          height={320}
          chartConfig={barChartConfig}
          style={[styles.chart, { marginLeft: -75 }]}
          showValuesOnTopOfBars={true}
          fromZero={true}
          segments={4}
          yAxisSuffix=""
          yAxisInterval={1}
          verticalLabelRotation={-45}
        />
      );
    }
    else if (selectedPeriod === 'week') {
      return renderWeeklyPieChart();
    } else if (selectedPeriod === 'month') {
      return renderMonthlyChart();
    } else if ( selectedPeriod === 'year') {
      return renderYearlyChart();
    }
  }

  const generateYearItems = () => {
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
      years.push(
        <Picker.Item key={year} label={year.toString()} value={year} style={{ fontSize: 14 }} />
      );
    }
    return years;
  };

  const renderReportTypeItems = () => {
    if (selectedPeriod === 'day') {
      return [
        <Picker.Item key="sales" label="Total Sales" value="sales" />,
        <Picker.Item key="appointments" label="Appointments" value="appointments" />,
        <Picker.Item key="leads" label="New Leads" value="leads" />
      ];
    } else if (selectedPeriod === 'week') {
      return [
        <Picker.Item key="sales" label="Total Sales" value="sales" />,
        <Picker.Item key="appointments" label="Appointments" value="appointments" />,
        <Picker.Item key="leads" label="New Leads" value="leads" />,
        <Picker.Item key="sold" label="Properties Sold" value="sold" />,
        <Picker.Item key="listings" label="New Listings" value="listings" />
      ];
    } else {
      return [
        <Picker.Item key="leadActivity" label="Lead Activity" value="leadActivity" />,
        <Picker.Item key="marketActivity" label="Market Activity" value="marketActivity" />,
        <Picker.Item key="sales" label="Total Sales" value="sales" />,
        <Picker.Item key="aveSalePrice" label="Ave. Sale Price" value="aveSalePrice" />
      ];
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
          <Text style={styles.title}>My Stats</Text>
        </View>
        <ProfileHeader />
      </LinearGradient>

      <StatsCard />

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Summary Report</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'day' && styles.selectedPeriod]}
            onPress={() => setSelectedPeriod('day')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'day' && { color: '#fff' }]}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.selectedPeriod]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'week' && { color: '#fff' }]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.selectedPeriod]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'month' && { color: '#fff' }]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'year' && styles.selectedPeriod]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'year' && { color: '#fff' }]}>Yearly</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectorContainer}>
          <View style={styles.weekSelector}>
            {selectedPeriod === 'day' ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedWeekRange}
                  style={styles.picker}
                  onValueChange={handleWeekRangeChange}
                >
                  {weekRanges.map((range) => (
                    <Picker.Item key={range.value} label={range.label} value={range.value} style={{ fontSize: 14 }} />
                  ))}
                </Picker>
              </View>
            ) : selectedPeriod === 'week' ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMonth}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                >
                  <Picker.Item label="January" value={1} style={{ fontSize: 14 }} />
                  <Picker.Item label="February" value={2} style={{ fontSize: 14 }} />
                  <Picker.Item label="March" value={3} style={{ fontSize: 14 }} />
                  <Picker.Item label="April" value={4} style={{ fontSize: 14 }} />
                  <Picker.Item label="May" value={5} style={{ fontSize: 14 }} />
                  <Picker.Item label="June" value={6} style={{ fontSize: 14 }} />
                  <Picker.Item label="July" value={7} style={{ fontSize: 14 }} />
                  <Picker.Item label="August" value={8} style={{ fontSize: 14 }} />
                  <Picker.Item label="September" value={9} style={{ fontSize: 14 }} />
                  <Picker.Item label="October" value={10} style={{ fontSize: 14 }} />
                  <Picker.Item label="November" value={11} style={{ fontSize: 14 }} />
                  <Picker.Item label="December" value={12} style={{ fontSize: 14 }} />
                </Picker>
              </View>
            ) : selectedPeriod === 'month' || (selectedPeriod === 'year' && (reportType === 'sales' || reportType === 'listings')) ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedYear}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
                >
                  {generateYearItems()}
                </Picker>
              </View>
            ) : null}
          </View>

          <View style={styles.reportSelector}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedreportType}
                style={styles.picker}
                onValueChange={(value) => setSelectedReportType(value)}
              >
                {renderReportTypeItems()}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.chartContainer}>{renderChart()}</View>
      </View>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEAFF'
  },
  gradient: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    height: 300,
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50
  },
  backButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12.5,
    paddingVertical: 10,
    borderRadius: 50
  },
  statsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    width: '100%'
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  selectedPeriod: {
    backgroundColor: '#7B61FF'
  },
  periodText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600'
  },
  selectorContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: 0,
    marginTop: 10
  },
  weekSelector: {
    width: '48%'
  },
  reportSelector: {
    width: '48%'
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    overflow: 'hidden'
  },
  picker: {
    height: 55,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  chartContainer: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -50,
    width: '100%',
    paddingBottom: 20
  },
  emptyChart: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#7B61FF',
    borderRadius: 10,
    marginLeft: 0,
    marginTop: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyChartText: {
    color: '#7B61FF',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
  }
});

export default StatisticsScreen;
