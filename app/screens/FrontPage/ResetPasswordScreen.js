import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Text } from "react-native-paper";
import { useData } from "../../context/DataContext";

import AnimatedBackground from "../../components/AnimatedBackground";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const { resetPasswordOtp } = useData(); // Access resetPassword from context

  const sendResetPasswordEmail = async () => {
    // Validate email is not empty
    if (!email.value) {
      setEmail({ value: email.value, error: "Email is required." }); // Set error message in email state
      return; // Exit the function if the email is empty
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      setEmail({ value: email.value, error: "Invalid email format." }); // Set error message in email state
      return; // Exit the function if the email is invalid
    }

    try {
      const responseData = await resetPasswordOtp.resetPasswordOTP(email.value);
      console.log("API Response:", responseData.error); // Log the response to debug
  
      // Check if response is a valid object and contains the expected success status
      if (responseData && (responseData.success || responseData.message === "OTP sent to your email.")) {
        navigation.navigate("ResetLinkScreen", { email: email.value });
      } else if (responseData.error === 'User not found.') {
        setEmail({ value: email.value, error: responseData.error }); // Set error message in email state
      } else {
        setEmail({ value: email.value, error: "Password reset failed: " + (responseData?.error || 'Unknown error') }); // Set error message in email state
      }
    } catch (error) {
      console.error("Error sending reset password email:", error);
    }
  };
  

  return (
    <AnimatedBackground>
      <View style={styles.backButtoncontainer}>
        <View style={styles.button}>
        <BackButton goBack={navigation.goBack}></BackButton>
        </View>
      </View>
      {/* <BackButton goBack={navigation.goBack} /> */}

      <Text style={styles.header}>Forgot Password?</Text>
      <Text style={styles.subHeader}>
        That's okay, it happens! Enter your email below to reset your password.
      </Text>

      <TextInput
        label="Enter Email"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={[styles.input, email.error ? { borderColor: 'red'} : {}]}
      />

      <Button mode="contained" onPress={sendResetPasswordEmail} style={styles.submitButton}>
        <Text style={styles.buttonText}>Submit</Text>
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
    color: "#7B61FF",
    textAlign: "left",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 20,
    color: "#000000",
    textAlign: "left",
    marginBottom: 24,
    marginTop: 5,
  },
  input: {
    width: "100%",
    marginTop: -20,
    borderRadius: 50,
    height: 64,
    borderColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#7B61FF",
    borderRadius: 50,
    height: 60,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 19,
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
