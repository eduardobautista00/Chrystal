

// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const AGENT_REQUEST = 'AGENT_REQUEST';
export const AGENT_SUCCESS = 'AGENT_SUCCESS';
export const AGENT_FAILURE = 'AGENT_FAILURE';
export const LOGOUT = 'LOGOUT';



// Async Action Creator

import getEnvVars from '../../config/env';
import axios from 'axios'; // Assuming you're using axios
import AsyncStorage from '@react-native-async-storage/async-storage';



const { apiUrl } = getEnvVars();

class AuthActions  {

  registerUser = async (dispatch, userInfo) => {
    console.log("Agent Info being sent to API:", userInfo); // Log the data
    dispatch({ type: 'REGISTER_REQUEST' });

    try {
      const response = await axios.post(`${apiUrl}/register`, {
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
          phone_number: userInfo.phone_number,
          password: userInfo.password,
          // type: agentInfo.type,
          // is_agent: true, // Since the user is always an agent
          //agency_name: companyInfo.agency_name || null, // Send company info if available
          //company_no_of_location: companyInfo.company_no_of_location || null, // Send if available
          //company_address: companyInfo.company_address || null, // Send if available
          //company_coverage: companyInfo.company_coverage || null, // Send if available
          //company_type: companyInfo.company_type || null, // Send if available
      });

        // Log the response for debugging
        console.log("API Response:", response.data);

       // const token = response.data.user.token; // Assuming token is returned
        const user = {  // Create a user object based on the response
          first_name: response.data.user.first_name, // Use data from API or from agentInfo if needed
          last_name: response.data.user.last_name, // Use data from API or from agentInfo if needed
          email: response.data.user.email, // Use data from API or from agentInfo if needed
          phone_number: response.user?.phone_number,
          password: response.user?.password,
          //is_agent: true, // Always true since the registration is for agents
          //agency_name: response.data.agency_name || companyInfo.agency_name || null, // From API or companyInfo
          //license_number: response.data.license_number || agentInfo.license_number, // From API or agentInfo
          //address: response.data.address || agentInfo.address, // Address from API or agentInfo
          //coverage: response.data.coverage || agentInfo.coverage, // Coverage from API or agentInfo
          //type: response.data.type || agentInfo.type, // Type from API or agentInfo
          //company_no_of_location: response.data.company_no_of_location || companyInfo.company_no_of_location || null, // Locations from API or companyInfo
          //company_address: response.data.company_address || companyInfo.company_address || null, // Company address from API or companyInfo
          //company_coverage: response.data.company_coverage || companyInfo.company_coverage || null, // Company coverage from API or companyInfo
          //company_type: response.data.company_type || companyInfo.company_type || null, // Company type from API or companyInfo
          //permissions: response.data.permissions || [], // Assuming permissions can be an array
      };
      console.log(user , "responseresponseresponse");
        // Store the token
    
        dispatch({
            type: 'REGISTER_SUCCESS',
            payload: {
              user: user
            },
        });
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        
        dispatch({
            type: 'REGISTER_FAILURE',
            error: error.response?.data || 'Registration failed',
        });
    }
};


registerAgent = async (dispatch, agentInfo) => {
  console.log("Agent Info being sent to API:", agentInfo); // Log the data
  dispatch({ type: 'REGISTER_REQUEST' });

  try {
    const response = await axios.post(`${apiUrl}/register-agent`, {
        first_name: agentInfo.first_name,
        last_name: agentInfo.last_name,
        email: agentInfo.email,
        phone_number: agentInfo.phone_number,
        password: agentInfo.password,
        License_number: agentInfo.License_number,
        address: agentInfo.address,
        coverage: agentInfo.coverage,
        property_type: agentInfo.property_type,
        with_company: agentInfo.with_company,
        company_name: agentInfo.company_name,
        no_of_location: agentInfo.no_of_location,
        company_address: agentInfo.company_address,
        company_property_coverage: agentInfo.company_property_coverage,
        company_property_type: agentInfo.company_property_type,
        // type: agentInfo.type,
        // is_agent: true, // Since the user is always an agent
        //agency_name: companyInfo.agency_name || null, // Send company info if available
        //company_no_of_location: companyInfo.company_no_of_location || null, // Send if available
        //company_address: companyInfo.company_address || null, // Send if available
        //company_coverage: companyInfo.company_coverage || null, // Send if available
        //company_type: companyInfo.company_type || null, // Send if available
    });

      // Log the response for debugging
      console.log("API Response:", response.data);

      const token = response.data.token; // Assuming token is returned
      const user = {  // Create a user object based on the response
        first_name: response.data.first_name, // Use data from API or from agentInfo if needed
        last_name: response.data.last_name, // Use data from API or from agentInfo if needed
        email: response.data.email, // Use data from API or from agentInfo if needed
        phone_number: response.phone_number,
        password: response.password,
        License_number: response.License_number,
        address: response.address,
        coverage: response.coverage,
        property_type: response.property_type,
        with_company: response.with_company,
        company_name: response.company_name,
        no_of_location: response.no_of_location,
        company_address: response.company_address,
        company_property_coverage: response.company_property_coverage,
        company_property_type: response.company_property_type,
        //is_agent: true, // Always true since the registration is for agents
        //agency_name: response.data.agency_name || companyInfo.agency_name || null, // From API or companyInfo
        //license_number: response.data.license_number || agentInfo.license_number, // From API or agentInfo
        //address: response.data.address || agentInfo.address, // Address from API or agentInfo
        //coverage: response.data.coverage || agentInfo.coverage, // Coverage from API or agentInfo
        //type: response.data.type || agentInfo.type, // Type from API or agentInfo
        //company_no_of_location: response.data.company_no_of_location || companyInfo.company_no_of_location || null, // Locations from API or companyInfo
        //company_address: response.data.company_address || companyInfo.company_address || null, // Company address from API or companyInfo
        //company_coverage: response.data.company_coverage || companyInfo.company_coverage || null, // Company coverage from API or companyInfo
        //company_type: response.data.company_type || companyInfo.company_type || null, // Company type from API or companyInfo
        //permissions: response.data.permissions || [], // Assuming permissions can be an array
    };
      const permission = response.data.permissions; 
      console.log(user);
    
      // Store the token
      await AsyncStorage.setItem('accessToken', token);
      console.log("Token stored successfully");

      dispatch({
          type: 'REGISTER_SUCCESS',
          payload: {
              user: user,
              token: token,
              permission: permission,
          },
      });
  } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      
      dispatch({
          type: 'REGISTER_FAILURE',
          error: error.response?.data || 'Registration failed',
      });
  }
};


 loginUser = async (dispatch, email, password) => {
  dispatch({ type: 'LOGIN_REQUEST' });

  try {
    const response = await axios.post(`${apiUrl}/login`, {
      email: email,
      password: password,
    });

    const token = response.data.token; // Assuming the token is returned on successful login
    const user = response.data.user; // Assuming the user data is returned as well
    const permission = response.data.permissions; 
    console.log(user);
    // Store the token in AsyncStorage or where required
    await AsyncStorage.setItem('accessToken', token);

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user : user,
        token : token,
        permission : permission,
      },
    });

  } catch (error) {
    //console.error('Login error:', error.response?.data || error.message);

    dispatch({
      type: 'LOGIN_FAILURE',
      error: error.response?.data || 'Login failed',
    });
  }
};

  logoutUser = async (dispatch) => {
    dispatch({
      type: 'LOGOUT'
    });
  }

  userPermission = (permission = "" , auth) => {
    try {
      if ((auth?.rolePermission).includes(permission)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  userRole =  (role_name = "" , auth) => {
    try {
      if (auth?.role === role_name) {
        return true;
      }

      return false;
    
      // });
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };
 
}

export default AuthActions;