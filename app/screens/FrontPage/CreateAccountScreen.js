import React, { useState, useLayoutEffect  } from "react";
import { TouchableOpacity, StyleSheet, View, Alert } from "react-native";
import { Text, Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as NavigationService from '../../navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import AnimatedBackground from "../../components/AnimatedBackground";
import BackButton from "../../components/BackButton";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import PhoneInput from "../../components/PhoneInput";
import FrontpageLayout from '../../layout/Frontpage';
import { theme } from "../../core/theme";
import { useData } from '../../context/DataContext';
import { emailValidator } from "../../utils/emailValidator";
import { passwordValidator } from "../../utils/passwordValidator";
import { nameValidator } from "../../utils/nameValidator";
import { phoneValidator } from "../../utils/phoneValidator";

export default function CreateAccountScreen({ route, navigation }) {
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [phone, setPhone] = useState({ countryCode: '+63', value: '', error: '', fullValue: '' });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", error: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { register: { registerUser } } = useData(); 
  const { accountType } = route.params;

  useLayoutEffect(() => {
    // Handle any necessary side effects
  }, []);

  const sendOTP = async (phone) => {
    try {
      const apiKey = '95b8201b';
      const apiSecret = 'JfftV0Acjh6fUhYr';
      const from = 'Chrystal';
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      const response = await axios.post('https://rest.nexmo.com/sms/json', {
        api_key: apiKey,
        api_secret: apiSecret,
        to: phone,
        from: from,
        text: `Your OTP code is ${otp}`,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      console.log("Response JSON:", response.data);
  
      if (response.data.messages[0].status === "0") {
        const messageId = response.data.messages[0]["message-id"];
        console.log(`OTP sent successfully to ${phone}`);
        return { success: true, messageId };
      } else {
        console.error("OTP Error:", response.data.messages[0].error_text);
        return { success: false, error: response.data.messages[0].error_text || "Failed to send OTP. Please try again." };
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      return { success: false, error: "Failed to send OTP. Please try again." };
    }
  };

  const validateInputs = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const firstNameError = nameValidator(firstName.value);
    const lastNameError = nameValidator(lastName.value);
    const phoneError = phoneValidator(phone.fullValue);
    const confirmPasswordError = password.value !== confirmPassword.value ? "Passwords do not match" : "";

    if (emailError || passwordError || confirmPasswordError || firstNameError || lastNameError || phoneError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      setFirstName({ ...firstName, error: firstNameError });
      setLastName({ ...lastName, error: lastNameError });
      setPhone({ ...phone, error: phoneError });
      return false;
    }
    return true;
  };

  const onSubmitPressed = async () => {
    if (!validateInputs()) return;

    console.log("All validations passed. Proceeding to registration...");

    const userInfo = {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        phone_number: phone.fullValue,
        password: password.value,
        password_confirmation: confirmPassword.value
    };

    try {
        const response = await registerUser(userInfo);

        // Ensure response is defined
        if (!response) {
            Alert.alert('Registration failed', 'An unknown error occurred');
            return; // Exit if response is undefined
        }

        // Check for success based on the response structure
        if (response.success || response.message === "User registered successfully") {
            console.log("Agent registered successfully.");
            navigation.navigate('AgentRegistrationScreen');
        } else {
            // Handle specific error messages
            const errorMessage = response.message || 'An unknown error occurred';
            Alert.alert('User already exists', errorMessage);
            console.error("Registration error:", response.error);
            // Prevent navigation if the email is already taken
            if (response.message === "The email has already been taken.") {
                return; // Exit the function to prevent navigation
            }
        }
    } catch (error) {
        console.error("Registration error:", error.message);
        Alert.alert('Registration error', error.message);
    }
  };

  return (
      <AnimatedBackground>
        <View style={styles.backButtoncontainer}>
        <View>
        <BackButton goBack={navigation.goBack}></BackButton>
        </View>
      </View>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subHeader}>
          Fill in the necessary information to register.
        </Text>
        <TextInput
          label="First Name"
          returnKeyType="next"
          value={firstName.value}
          onChangeText={(text) => setFirstName({ value: text, error: "" })}
          error={!!firstName.error}
          errorText={firstName.error}
          style={styles.input}
        />
        <TextInput
          label="Last Name"
          returnKeyType="next"
          value={lastName.value}
          onChangeText={(text) => setLastName({ value: text, error: "" })}
          error={!!lastName.error}
          errorText={lastName.error}
          style={styles.input}
        />
        <PhoneInput 
                phone={phone} 
                setPhone={setPhone}
                error={phone.error}
                style={styles.input}
            />
        <TextInput
          label="Email Address"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          label="Password"
          returnKeyType="next"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry={!passwordVisible}
          style={styles.input}
          right={
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          }
        />
        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          value={confirmPassword.value}
          onChangeText={(text) => setConfirmPassword({ value: text, error: "" })}
          error={!!confirmPassword.error}
          errorText={confirmPassword.error}
          secureTextEntry={!confirmPasswordVisible}
          style={styles.input}
          right={
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Icon
                name={confirmPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          }
        />
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={rememberMe ? "checked" : "unchecked"}
              onPress={() => setRememberMe(!rememberMe)}
              color={theme.colors.primary}
              size={14}
            />
            <Text style={styles.text}>
              I agree with Krystal's{" "}
              <Text style={styles.link}>Terms</Text>{" "}and{" "}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
        <Button mode="contained" onPress={onSubmitPressed} style={styles.loginButton}>
          <Text style={styles.buttonText}>Submit</Text>
        </Button>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => NavigationService.navigate('LoginScreen', { someParam: 'high 5' })}>
            <Text style={styles.signUp}> LOGIN</Text>
          </TouchableOpacity>
        </View>
      </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "left",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    color: "#7B61FF",
    marginBottom: 10,
    marginTop: 70,
  },
  subHeader: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 0,
  },
  input: {
    width: "100%",
    marginBottom: -10,
    borderRadius: 50,
    height: 64,
    color: 'gray',
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  text: {
    marginTop: 10,
    fontSize: 12,
  },
  link: {
    color: theme.colors.primary,
  },
  loginButton: {
    backgroundColor: "#7B61FF",
    borderRadius: 50,
    height: 58,
    justifyContent: "center",
    marginBottom: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    paddingTop: 0,    
  },
  footerText: {
    fontSize: 18,
  },
  signUp: {
    fontWeight: "regular",
    color: "#0068C8",
    fontSize: 18,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 19,
  },
  backButtoncontainer: {
    width: '55%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 40,
    left: 30,
  },
});
