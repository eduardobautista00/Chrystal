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
  const [coverage, setCoverage] = useState({ value: "", error: "" });
  const [type, setType] = useState({ value: "", error: "" });
  const { agentInfo } = route.params; // Get agentInfo from navigation route parameters
  const { register_user } = register.registerState;
  console.log(agentInfo);


  const validateInputs = () => {
    let isValid = true;

    if (!agencyName.value) {
      setagencyName({ ...agencyName, error: "Company name is required" });
      isValid = false;
    }
    if (!numberOfLocations.value) {
      setNumberOfLocations({ ...numberOfLocations, error: "Number of locations is required" });
      isValid = false;
    }
    if (!address.value) {
      setAddress({ ...address, error: "Address is required" });
      isValid = false;
    }
    if (!coverage.value) {
      setCoverage({ ...coverage, error: "Coverage is required" });
      isValid = false;
    }
    if (!type.value) {
      setType({ ...type, error: "Type is required" });
      isValid = false;
    }

    return isValid;
  };

  const onSubmitPressed = async () => {
    // Add company details directly into agentInfo
    agentInfo.company_name = agencyName.value;
    agentInfo.no_of_location = numberOfLocations.value;
    agentInfo.company_address = address.value;
    agentInfo.company_property_coverage = coverage.value;
    agentInfo.company_property_type = type.value;

    // Pass both agent info and company info to the registerUser
    try {
        await register.registerAgent(agentInfo); // Call registerUser with both sets of data
        //console.log(agentInfo);
        navigation.navigate('AgentRegistrationSuccess');
    } catch (error) {
        console.error("Registration error:", error);
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
        <TextInput
          label="No. of Locations"
          returnKeyType="next"
          value={numberOfLocations.value}
          onChangeText={(text) => setNumberOfLocations({ value: text, error: "" })}
          error={!!numberOfLocations.error}
          errorText={numberOfLocations.error}
          style={styles.input}
        />
        <TextInput
          label="Address"
          returnKeyType="next"
          value={address.value}
          onChangeText={(text) => setAddress({ value: text, error: "" })}
          error={!!address.error}
          errorText={address.error}
          style={styles.input}
        />
        <TextInput
          label="Coverage"
          returnKeyType="next"
          value={coverage.value}
          onChangeText={(text) => setCoverage({ value: text, error: "" })}
          error={!!coverage.error}
          errorText={coverage.error}
          style={styles.input}
        />
        <Text style={styles.exampleText}>Example: rural, suburban, urban.</Text>

        <TextInput
          label="Type"
          returnKeyType="done"
          value={type.value}
          onChangeText={(text) => setType({ value: text, error: "" })}
          error={!!type.error}
          errorText={type.error}
          style={styles.input}
        />
        <Text style={styles.exampleText}>Example: house, townhouse, unit, land.</Text>

        <Button mode="contained" onPress={onSubmitPressed} style={styles.submitButton}>
          <Text style={styles.buttonText}>Register</Text>
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
});
