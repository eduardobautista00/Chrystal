import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Alert } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AnimatedBackground from "../../components/AnimatedBackground";
import BackButton from "../../components/BackButton";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import FrontpageLayout from '../../layout/Frontpage';
import { useData } from "../../context/DataContext"; // Import useData

export default function CompanyDetailsScreen({ navigation, route }) {
  const { register } = useData();
  const [agencyName, setagencyName] = useState({ value: "", error: "" });
  const [numberOfLocations, setNumberOfLocations] = useState({ value: "", error: "" });
  const [address, setAddress] = useState({ value: "", error: "" });
  const [coverage, setCoverage] = useState([]);
  const [coverageError, setCoverageError] = useState("");
  const [type, setType] = useState([]);
  const [typeError, setTypeError] = useState("");
  const [coverage, setCoverage] = useState([]);
  const [coverageError, setCoverageError] = useState("");
  const [type, setType] = useState([]);
  const [typeError, setTypeError] = useState("");
  const { agentInfo } = route.params; // Get agentInfo from navigation route parameters
  const register_user  = register.registerState;
  console.log('agentInfo', agentInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInputs = () => {
    let isValid = true;

    if (!agencyName.value) {
      setagencyName({ ...agencyName, error: "Company name is required" });
      isValid = false;
    }
    // if (!numberOfLocations.value) {
    //   setNumberOfLocations({ ...numberOfLocations, error: "Number of locations is required" });
    //   isValid = false;
    // }
    if (!address.value) {
      setAddress({ ...address, error: "Address is required" });
      isValid = false;
    }
    if (coverage.length === 0) {
      setCoverageError("Coverage is required");
    if (coverage.length === 0) {
      setCoverageError("Coverage is required");
      isValid = false;
    } else {
      setCoverageError("");
    } else {
      setCoverageError("");
    }
    if (type.length === 0) {
      setTypeError("Type is required");
    if (type.length === 0) {
      setTypeError("Type is required");
      isValid = false;
    } else {
      setTypeError("");
    } else {
      setTypeError("");
    }

    return isValid;
  };

  const toggleCoverage = (option) => {
    setCoverageError(""); // Clear error when user makes a selection
    setCoverage((prev) => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const toggleType = (option) => {
    setTypeError(""); // Clear error when user makes a selection
    setType((prev) => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const toggleCoverage = (option) => {
    setCoverageError(""); // Clear error when user makes a selection
    setCoverage((prev) => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const toggleType = (option) => {
    setTypeError(""); // Clear error when user makes a selection
    setType((prev) => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const onSubmitPressed = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    const isValid = validateInputs();
    if (!isValid) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true); // Start loading

    try {
      agentInfo.company_name = agencyName.value;
      agentInfo.company_address = address.value;
      agentInfo.company_property_coverage = coverage.join(", ");
      agentInfo.company_property_type = type.join(", ");

      console.log('Complete agentInfo', agentInfo);
      const response = await register.registerAgent(agentInfo);
      
      // Check for specific error cases
      if (response && response.status === 'error') {
        if (response.message === "The license number has already been taken.") {
          Alert.alert(
            "Registration Failed",
            "This license number is already registered in our system. Please verify your license number or contact support if you believe this is an error."
          );
        } else {
          Alert.alert("Registration Failed", response.message || "Failed to register. Please try again.");
        }
        return;
      }
      
      navigation.navigate('AgentRegistrationSuccess');
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Error",
        "An error occurred during registration. Please try again."
      );
    } finally {
      setIsSubmitting(false); // End loading
    }
  };
  };

  return (
      <AnimatedBackground>
        <View style={styles.backButtoncontainer}>
        <View>
        <BackButton goBack={navigation.goBack}></BackButton>
        </View>
      </View>
        {/* <BackButton goBack={navigation.goBack} /> */}
        <Text style={styles.header}>Company Details</Text>
        <Text style={styles.subHeader}>
            Complete your company profile to continue.
        </Text>

        <TextInput
          label="Company Name"
          returnKeyType="next"
          value={agencyName.value}
          onChangeText={(text) => setagencyName({ value: text, error: "" })}
          error={!!agencyName.error}
          errorText={agencyName.error}
          style={styles.input}
        />
        {/* <TextInput
          label="No. of Locations"
          returnKeyType="next"
          value={numberOfLocations.value}
          onChangeText={(text) => setNumberOfLocations({ value: text, error: "" })}
          error={!!numberOfLocations.error}
          errorText={numberOfLocations.error}
          style={styles.input}
        /> */}
        <TextInput
          label="Address"
          returnKeyType="next"
          value={address.value}
          onChangeText={(text) => setAddress({ value: text, error: "" })}
          error={!!address.error}
          errorText={address.error}
          style={styles.input}
        />
        <View style={styles.coverageContainer}>
          <Text style={styles.label}>Coverage</Text>
          <View style={styles.coverageOptions}>
            {['Rural', 'Suburban', 'Urban'].map((option) => (
              <TouchableOpacity 
                key={option} 
                onPress={() => toggleCoverage(option)} 
                style={[styles.coverageOptionButton, coverage.includes(option) && styles.selectedCoverageOption]}
              >
                <Text style={[styles.optionText, coverage.includes(option) && styles.selectedText]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.selectedText}>Selected Coverage: {coverage.join(", ")}</Text>
        </View>

        <View style={styles.propertyTypeContainer}>
          <Text style={styles.label}>Property Type</Text>
          <View style={styles.propertyTypeOptions}>
            <View style={styles.propertyTypeRow}>
              <TouchableOpacity 
                key="House" 
                onPress={() => toggleType('House')} 
                style={[styles.propertyTypeOptionButton, type.includes('House') && styles.selectedPropertyTypeOption]}
              >
                <Text style={[styles.optionText, type.includes('House') && styles.selectedText]}>House</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                key="Townhouse" 
                onPress={() => toggleType('Townhouse')} 
                style={[styles.propertyTypeOptionButton, type.includes('Townhouse') && styles.selectedPropertyTypeOption]}
              >
                <Text style={[styles.optionText, type.includes('Townhouse') && styles.selectedText]}>Townhouse</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.propertyTypeRow}>
              <TouchableOpacity 
                key="Unit" 
                onPress={() => toggleType('Unit')} 
                style={[styles.propertyTypeOptionButton, type.includes('Unit') && styles.selectedPropertyTypeOption]}
              >
                <Text style={[styles.optionText, type.includes('Unit') && styles.selectedText]}>Unit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                key="Land" 
                onPress={() => toggleType('Land')} 
                style={[styles.propertyTypeOptionButton, type.includes('Land') && styles.selectedPropertyTypeOption]}
              >
                <Text style={[styles.optionText, type.includes('Land') && styles.selectedText]}>Land</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.selectedText}>Selected Property Type: {type.join(", ")}</Text>
        </View>

        <Button 
          mode="contained" 
          onPress={onSubmitPressed} 
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Processing..." : "Register"}
          </Text>
        </Button>
      </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "flex-start",
    color: "#7B61FF",
    marginBottom: 10,
    marginTop: 70,
  },
  subHeader: {
    fontSize: 20,
    color: "#000000",
    textAlign: "flex-start",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    marginBottom: -10,
    borderRadius: 50,
  },
  submitButton: {
    backgroundColor: "#7B61FF",
    borderRadius: 24,
    marginTop: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  exampleText: {
    color: '#00000080',
    fontStyle: 'italic',
  },
  backButtoncontainer: {
    width: '55%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 30,
    paddingTop: 20
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
  propertyTypeOptions: {
    flexDirection: 'column',
    gap: 10,
  },
  propertyTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverageOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: "center",
    width: '30%',
  },
  propertyTypeOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: "center",
    width: '48%',
  },
  selectedCoverageOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  selectedPropertyTypeOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  optionText: {
    color: '#FFFFFF',
  },
  selectedText: {
    color: '#7B61FF',
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
  propertyTypeOptions: {
    flexDirection: 'column',
    gap: 10,
  },
  propertyTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverageOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: "center",
    width: '30%',
  },
  propertyTypeOptionButton: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    backgroundColor: "#7B61FF",
    borderRadius: 20,
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: "center",
    width: '48%',
  },
  selectedCoverageOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  selectedPropertyTypeOption: {
    backgroundColor: "#FFFFFF", // Change background when selected
    borderColor: "#7B61FF", // Keep border consistent
  },
  optionText: {
    color: '#FFFFFF',
  },
  selectedText: {
    color: '#7B61FF',
  },
});
