import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
// import Button from '../../components/Button'
import TextInput from "../../components/TextInput";
import AnimatedBackground from '../../components/AnimatedBackground';
import BackButton from '../../components/BackButton';
import { useData } from "../../context/DataContext"; // Import useData
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown component
import getEnvVars from '../../config/env';

export default function AgentRegistrationScreen({ navigation }) {
  const { register } = useData(); // Access register and registerAgent
  const register_user = register.registerState;
  console.log('register', register_user)
  const { apiUrl } = getEnvVars();
  const [agentData, setAgentData] = useState({
    full_name: '',
    email: '',
    password: '',
    license_number: '',
    address: '',
    coverage: '',
    property_type: '',
    with_company: true,
    user_id: '',
    company_name: '',
    //no_of_location: '',
    company_address: '',
    company_property_coverage: '',
    company_property_type: '',
  });
  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState("Yes");
  
  
  const coverageOptions = ['Rural', 'Suburban', 'Urban'];
  const propertyTypeOptions = ['House', 'Townhouse', 'Unit', 'Land'];


  console.log('with company?', agentData.with_company);

  

  const handleCoverageSelect = (value) => {
    const currentCoverage = agentData.coverage.split(',').map(item => item.trim());
    if (currentCoverage.includes(value)) {
      // Remove the value if it's already selected
      const newCoverage = currentCoverage.filter(item => item !== value).join(', ');
      setAgentData((prevData) => ({ ...prevData, coverage: newCoverage }));
      console.log('coverage updated', newCoverage); // Log the updated coverage
    } else {
      // Add the value if it's not selected
      const newCoverage = currentCoverage.length === 0 ? value : `${agentData.coverage.trim() ? agentData.coverage + ', ' : ''}${value}`; // Ensure no leading comma
      setAgentData((prevData) => ({ ...prevData, coverage: newCoverage }));
      console.log('coverage updated', newCoverage); // Log the updated coverage
    }
  };

  const handlePropertyTypeSelect = (value) => {
    const currentPropertyType = agentData.property_type.split(',').map(item => item.trim());
    if (currentPropertyType.includes(value)) {
      // Remove the value if it's already selected
      const newPropertyType = currentPropertyType.filter(item => item !== value).join(', ');
      setAgentData((prevData) => ({ ...prevData, property_type: newPropertyType }));
      console.log('property type updated', newPropertyType); // Log the updated property type
    } else {
      // Add the value if it's not selected
      const newPropertyType = currentPropertyType.length === 0 ? value : `${agentData.property_type.trim() ? agentData.property_type + ', ' : ''}${value}`; // Ensure no leading comma
      setAgentData((prevData) => ({ ...prevData, property_type: newPropertyType }));
      console.log('property type updated', newPropertyType); // Log the updated property type
    }
  };

  //console.log(register);
  //console.log(user);  

  useEffect(() => {
    if (register_user && register_user.register_user.fullName) {
      setAgentData((prevData) => ({
        ...prevData,
        full_name: register_user.register_user.fullName, // Pre-fill the fullName from register_user
        email: register_user.email,       // Set email without displaying it in an input
        password: register_user.password, // Set password without displaying it in an input
      }));
    }
    //console.log("email:", email);
    //console.log("password:", password);
    // console.log(register, "asdasdasdasd");
  }, [register_user]);

  const validateInputs = () => {
    const newErrors = {};
    if (!agentData.full_name) newErrors.full_name = "Full Name is required";
    if (!agentData.license_number) newErrors.license_number = "License Number is required";
    if (!agentData.address) newErrors.address = "Address is required";
    if (!agentData.coverage) newErrors.coverage = "Coverage is required";
    if (!agentData.property_type) newErrors.property_type = "Type is required";
    if (company === null) Alert.alert('Error', 'Please select if you are with a company');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && company !== null;
  };

  const checkLicenseNumberExists = async (licenseNumber) => {
    try {
      const response = await fetch(`${apiUrl}/agents`); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Get the JSON data
      const agents = data.agents; // Access the agents array from the response

      // Ensure agents is an array before calling some
      if (Array.isArray(agents)) {
        return agents.some(agent => agent.license_number === licenseNumber);
      } else {
        console.error('Expected an array but got:', agents);
        return false; // Return false if agents is not an array
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      return false; // Assume the license number does not exist if there's an error
    }
  };

  const handleSubmit = async () => {
    console.log('handle submit called');
    console.log('Current agentData:', agentData);
    console.log('Current register_user:', register_user);

    if (!register_user || !register_user.register_user || !register_user.register_user.id) {
      console.error('Missing required user registration data');
      Alert.alert('Error', 'Missing required registration data. Please try again.');
      return;
    }

    if (!validateInputs()) {
      console.log('Input validation failed');
      return;
    }

    // Check if the license number already exists
    const licenseExists = await checkLicenseNumberExists(agentData.license_number);
    if (licenseExists) {
      setErrors((prevErrors) => ({ ...prevErrors, license_number: "License number already exists." }));
      return;
    }

    // Normalize coverage and property type for validation
    const currentCoverage = agentData.coverage.split(',').map(item => item.trim().toLowerCase());
    const currentPropertyType = agentData.property_type.split(',').map(item => item.trim().toLowerCase());

    // Additional validation for coverage and property type
    const validCoverage = currentCoverage.every(value => ['rural', 'suburban', 'urban'].includes(value));
    const validPropertyType = currentPropertyType.every(value => ['house', 'townhouse', 'unit', 'land'].includes(value));

    if (!validCoverage) {
      setErrors((prevErrors) => ({ ...prevErrors, coverage: "Coverage must be one of: rural, suburban, urban." }));
      console.log('Coverage validation failed');
      return;
    }

    if (!validPropertyType) {
      setErrors((prevErrors) => ({ ...prevErrors, property_type: "Property Type must be one of: house, townhouse, unit, land." }));
      console.log('Property type validation failed');
      return;
    }


    const [firstName, ...lastNameParts] = agentData.full_name.split(' ');
    const lastName = lastNameParts.join(' ');
    const agentInfo = {
      //first_name: firstName,
      //last_name: lastName,
      //email: register_user.email,
      //password: register_user.password,
      user_id: register_user.register_user.id, // Add the user_id from the registered user
      license_number: agentData.license_number,
      address: agentData.address,
      coverage: agentData.coverage,
      property_type: agentData.property_type,
      with_company: agentData.with_company,
      company_name: '',
      //no_of_location: '',
      company_address: '',
      company_property_coverage: '',
      company_property_type: '',
    };

    if (agentInfo.with_company === true && !errors.license_number) {
      console.log('Navigating to CompanyDetailsScreen with agentInfo:', agentInfo);
      navigation.navigate('CompanyDetailsScreen', { agentInfo });
    } else {
      try {
        console.log('Attempting to register agent:', agentInfo);
        const response = await register.registerAgent(agentInfo);
        console.log('Registration response:', response);

        if (response && response.status === "success") {
          console.log('Registration successful, navigating to AgentRegistrationSuccess');
          navigation.navigate('AgentRegistrationSuccess');
        } else if (response && response.message === "The email has already been taken.") {
          // If the email exists but it's the same as the registered user, proceed
          if (register_user && register_user.register_user.email === agentInfo.email) {
            console.log('Using existing user account for agent registration');
            navigation.navigate('AgentRegistrationSuccess');
          } else {
            setErrors((prevErrors) => ({ 
              ...prevErrors, 
              registration: 'An error occurred during registration.' 
            }));
          }
        } else {
          setErrors((prevErrors) => ({ 
            ...prevErrors, 
            registration: response?.message || 'An error occurred during registration.' 
          }));
        }
      } catch (error) {
        console.error('Registration error:', error);
        Alert.alert('Registration Error', error.message || 'An error occurred while registering. Please try again.');
      }
    }
  };

  const handleErrors = (error) => {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const newErrors = {};
  
      // If the API response has an 'error' status
      if (errorData.status === "error" && errorData.message) {
        const errorMessage = errorData.message;
  
        // Check if the error message contains specific text, such as "email has already been taken"
        if (errorMessage.includes('email has already been taken')) {
          newErrors.email = 'The email has already been taken.';
        }
  
        // Optionally, you can check for other common error phrases and set the relevant errors
        if (errorMessage.includes('license number')) {
          newErrors.license_number = 'License number is required or already taken.';
        }
        if (errorMessage.includes('address')) {
          newErrors.address = 'Address is required or already in use.';
        }
        if (errorMessage.includes('coverage')) {
          newErrors.coverage = 'Coverage is required.';
        }
        if (errorMessage.includes('property type')) {
          newErrors.property_type = 'Property type is required.';
        }
      }
  
      // Handling specific field-level errors in the errorData (in case of field validation errors)
      if (errorData.errors) {
        if (errorData.errors.email) newErrors.email = errorData.errors.email.join(' ');
        if (errorData.errors.license_number) newErrors.license_number = errorData.errors.license_number.join(' ');
        if (errorData.errors.address) newErrors.address = errorData.errors.address.join(' ');
        if (errorData.errors.coverage) newErrors.coverage = errorData.errors.coverage.join(' ');
        if (errorData.errors.property_type) newErrors.property_type = errorData.errors.property_type.join(' ');
      }
  
      setErrors(newErrors);
  
      // Optionally, display an alert with the error message if needed
      if (Object.keys(newErrors).length > 0) {
        Alert.alert('Registration Error', 'Please check the form for errors.');
      }
    }
  };
  
  
  return (
    <AnimatedBackground>
      <View style={styles.backButtoncontainer}>
        <View>
        <BackButton goBack={navigation.goBack}></BackButton>
        </View>
      </View>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Text style={styles.header}>Agent Registration</Text>
      <Text style={styles.subHeader}>Complete your agent profile.</Text>
  
      {/* Full Name Input */}
      <TextInput
        label="Full Name"
        returnKeyType="next"
        value={agentData.full_name}
        onChangeText={(text) => setAgentData((prevData) => ({ ...prevData, full_name: text }))}
        error={!!errors.full_name}
        errorText={errors.full_name}
        style={styles.input}
      />
  
      {/* License Number Input */}
      <TextInput
        label="License Number"
        returnKeyType="next"
        value={agentData.license_number}
        onChangeText={(text) => setAgentData((prevData) => ({ ...prevData, license_number: text }))}
        error={!!errors.license_number || !!errors.registration}
        errorText={errors.license_number || errors.registration}
        style={styles.input}
      />

  
      {/* Address Input */}
      <TextInput
        label="Address"
        returnKeyType="next"
        value={agentData.address}
        onChangeText={(text) => setAgentData((prevData) => ({ ...prevData, address: text }))}
        error={!!errors.address}
        errorText={errors.address}
        style={styles.input}
      />
  
      {/* Coverage Area Input */}
      <View style={styles.coverageContainer}>
        <Text style={styles.label}>Coverage</Text>
        <View style={styles.coverageOptions}>
          {coverageOptions.map((option) => (
            <TouchableOpacity 
              key={option} 
              onPress={() => handleCoverageSelect(option)} 
              style={[
                styles.coverageOptionButton,
                agentData.coverage.split(',').map(item => item.trim()).includes(option) && styles.selectedCoverageOption
              ]}
            >
              <Text style={[
                styles.optionText,
                agentData.coverage.split(',').map(item => item.trim()).includes(option) && styles.selectedText
              ]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.selectedText}>Selected Coverage: {agentData.coverage}</Text>
        {errors.coverage && <Text style={styles.errorText}>{errors.coverage}</Text>}
      </View>
  
      {/* Property Type Input */}
      <View style={styles.propertyTypeContainer}>
        <Text style={styles.label}>Property Type</Text>
        <View style={styles.propertyTypeOptionsContainer}>
          <View style={styles.propertyTypeRow}>
            {propertyTypeOptions.slice(0, 2).map((option) => (
              <TouchableOpacity 
                key={option} 
                onPress={() => handlePropertyTypeSelect(option)} 
                style={[
                  styles.propertyTypeOptionButton,
                  agentData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedPropertyTypeOption
                ]}
              >
                <Text style={[
                  styles.optionText,
                  agentData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedText
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.propertyTypeRow}>
            {propertyTypeOptions.slice(2, 4).map((option) => (
              <TouchableOpacity 
                key={option} 
                onPress={() => handlePropertyTypeSelect(option)} 
                style={[
                  styles.propertyTypeOptionButton,
                  agentData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedPropertyTypeOption
                ]}
              >
                <Text style={[
                  styles.optionText,
                  agentData.property_type.split(',').map(item => item.trim()).includes(option) && styles.selectedText
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={styles.selectedText}>Selected Property Type: {agentData.property_type}</Text>
        {errors.property_type && <Text style={styles.errorText}>{errors.property_type}</Text>}
      </View>
  
      {/* Company Selection */}
      <Text style={styles.companyText}>Are you with a company?</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => {
            if (company !== "Yes") { // Check if the button is already selected
              setAgentData((prevData) => ({ ...prevData, with_company: true }));
              setCompany("Yes");
              console.log(agentData.with_company); // Log the current state
            }
          }}
          style={[
            styles.optionButton,
            company === "Yes" && styles.selectedButton,
          ]}
          disabled={company === "Yes"} // Disable button if already selected
        >
          <Text
            style={[
              styles.optionText,
              company === "Yes" && styles.selectedText,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={() => {
            if (company !== "No") { // Check if the button is already selected
              setAgentData((prevData) => ({ ...prevData, with_company: false }));
              setCompany("No");
              console.log(agentData.with_company); // Log the current state
            }
          }}
          style={[
            styles.optionButton,
            company === "No" && styles.selectedButton,
          ]}
          disabled={company === "No"} // Disable button if already selected
        >
          <Text
            style={[
              styles.optionText,
              company === "No" && styles.selectedText,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
  
      {/* Submit Button */}
      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Submit
      </Button>
    </AnimatedBackground>
  );
  
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    color: "#7B61FF",
    marginBottom: 10,
    marginTop: 70,
  },
  subHeader: {
    fontSize: 20,
    color: "#000000",
    textAlign: "left",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    marginBottom: -10,
    borderRadius: 50,
  },
  exampleText: {
    color: '#00000080',
    fontStyle: 'italic',
  },
  companyText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: "#000000",
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: "center",
    width: '48%'
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectedButton: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  selectedText: {
    color: '#7B61FF',
  },
  submitButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 10,
    borderRadius: 50,
  },
  backButtoncontainer: {
    width: '55%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 30,
    //paddingTop: 20
  },
  coverageOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    //paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: 'center',
    width: '30%'
  },
  propertyTypeOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    //paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: 'center',
    width: '50%'
  },
  coverageContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  coverageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyTypeContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  propertyTypeOptionsContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  propertyTypeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  selectedCoverageOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  selectedPropertyTypeOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
