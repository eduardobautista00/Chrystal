import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
// import Button from '../../components/Button'
import TextInput from "../../components/TextInput";
import AnimatedBackground from '../../components/AnimatedBackground';
import BackButton from '../../components/BackButton';
import { useData } from "../../context/DataContext"; // Import useData

export default function AgentRegistrationScreen({ navigation }) {
  const { register } = useData(); // Access register and registerAgent
  const [agentData, setAgentData] = useState({
    fullName: ``,
    email: '',
    password: '',
    licenseNumber: '',
    address: '',
    coverage: '',
    propertyType: '',
    withCompany: false,
    companyName: '',
    noofLocation: '',
    companyAddress: '',
    companyCoverage: '',
    companyPropertyType: '',
  });
  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState(null);
  const { register_user } = register.registerState;
  
  //console.log(register);
  //console.log(user);

  useEffect(() => {
    if (register_user && register_user.fullName) {
      setAgentData((prevData) => ({
        ...prevData,
        fullName: register_user.fullName, // Pre-fill the fullName from register_user
        email: '${register_user.email}_test',       // Set email without displaying it in an input
        password: register_user.password, // Set password without displaying it in an input
      }));
    }
    //console.log("email:", email);
    //console.log("password:", password);
    // console.log(register, "asdasdasdasd");
  }, [register_user]);

  const validateInputs = () => {
    const newErrors = {};
    if (!agentData.fullName) newErrors.fullName = "Full Name is required";
    if (!agentData.licenseNumber) newErrors.licenseNumber = "License Number is required";
    if (!agentData.address) newErrors.address = "Address is required";
    if (!agentData.coverage) newErrors.coverage = "Coverage is required";
    if (!agentData.propertyType) newErrors.propertyType = "Type is required";
    if (company === null) Alert.alert('Error', 'Please select if you are with a company');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && company !== null;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
  
    const [firstName, ...lastNameParts] = agentData.fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    const agentInfo = {
      first_name: firstName,
      last_name: lastName,
      email: register_user.email,
      password: register_user.password,
      license_number: agentData.licenseNumber,
      address: agentData.address,
      coverage: agentData.coverage,
      property_type: agentData.propertyType,
      with_company: agentData.withCompany,
      companyName: '',
      noofLocation: '',
      companyAddress: '',
      companyCoverage: '',
      companyPropertyType: '',
    };
    
    if (agentData.withCompany) {
      navigation.navigate('CompanyDetailsScreen', { agentInfo });
    } else {
      try {
        await register.registerAgent(agentInfo);
        navigation.navigate('AgentRegistrationSuccess');
      } catch (error) {
        handleErrors(error);
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
          newErrors.licenseNumber = 'License number is required or already taken.';
        }
        if (errorMessage.includes('address')) {
          newErrors.address = 'Address is required or already in use.';
        }
        if (errorMessage.includes('coverage')) {
          newErrors.coverage = 'Coverage is required.';
        }
        if (errorMessage.includes('property type')) {
          newErrors.propertyType = 'Property type is required.';
        }
      }
  
      // Handling specific field-level errors in the errorData (in case of field validation errors)
      if (errorData.errors) {
        if (errorData.errors.email) newErrors.email = errorData.errors.email.join(' ');
        if (errorData.errors.license_number) newErrors.licenseNumber = errorData.errors.license_number.join(' ');
        if (errorData.errors.address) newErrors.address = errorData.errors.address.join(' ');
        if (errorData.errors.coverage) newErrors.coverage = errorData.errors.coverage.join(' ');
        if (errorData.errors.property_type) newErrors.propertyType = errorData.errors.property_type.join(' ');
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
        value={agentData.fullName}
        onChangeText={(text) => setAgentData((prevData) => ({ ...prevData, fullName: text }))}
        error={!!errors.fullName}
        errorText={errors.fullName}
        style={styles.input}
      />
  
      {/* License Number Input */}
      <TextInput
        label="License Number"
        returnKeyType="next"
        value={agentData.licenseNumber}
        onChangeText={(text) => setAgentData((prevData) => ({ ...prevData, licenseNumber: text }))}
        error={!!errors.licenseNumber}
        errorText={errors.licenseNumber}
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
      <TextInput
        label="Coverage"
        returnKeyType="next"
        value={agentData.coverage}
        onChangeText={(text) => setAgentData((prevData) => ({ ...prevData, coverage: text }))}
        error={!!errors.coverage}
        errorText={errors.coverage}
        style={styles.input}
      />
      <Text style={styles.exampleText}>Example: rural, suburban, urban.</Text>
  
      {/* Property Type Input */}
      <TextInput
        label="Type"
        returnKeyType="next"
        value={agentData.propertyType}
        onChangeText={(text) => setAgentData((prevData) => ({ ...prevData, propertyType: text }))}
        error={!!errors.propertyType}
        errorText={errors.propertyType}
        style={styles.input}
      />
      <Text style={styles.exampleText}>Example: house, townhouse, unit, land.</Text>
  
      {/* Company Selection */}
      <Text style={styles.companyText}>Are you with a company?</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => {
            setCompany("Yes");
            setAgentData((prevData) => ({ ...prevData, withCompany: true }));
            console.log(agentData.withCompany); // Log the current state
          }}
          style={[
            styles.optionButton,
            company === "Yes" && styles.selectedButton,
          ]}
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
            setCompany("No");
            setAgentData((prevData) => ({ ...prevData, withCompany: false }));
            console.log(agentData.withCompany); // Log the current state
          }}
          style={[
            styles.optionButton,
            company === "No" && styles.selectedButton,
          ]}
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
});
