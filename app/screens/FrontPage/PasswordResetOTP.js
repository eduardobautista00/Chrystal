import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, View, Alert } from "react-native";
import { Text } from "react-native-paper";
import axios from 'axios';

import AnimatedBackground from "../../components/AnimatedBackground";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import OTPInput from "../../components/OTPInput";
import { useData } from '../../context/DataContext';

export default function PasswordResetOTP({ route, navigation }) {
  const [otp, setOtp] = useState(Array(6).fill("")); // For 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOtp, resetPasswordOtp } = useData();
  const { email } = route.params;
  const [countdown, setCountdown] = useState(60); // Countdown in seconds
  const timerRef = useRef(null);
  const [otpError, setOtpError] = useState(false); // Track OTP validity

  // Create refs for each OTP input field
  const inputRefs = otp.map(() => useRef(null)); // Create refs for each OTP input

  useEffect(() => {
    console.log("Navigated to PasswordResetOTP");
    console.log("email:", email);
    startCountdown(); // Start the countdown on component mount

    return () => clearInterval(timerRef.current); // Clean up timer on component unmount
  }, [email]);

  const startCountdown = () => {
    // Clear any existing timer
    clearInterval(timerRef.current);

    setCountdown(60); // Set initial countdown to 60 seconds

    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timerRef.current); // Stop countdown at 0
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleInputChange = (index, value) => {
    if (/^[0-9]*$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to the next input if the value is not empty
      if (value && inputRefs[index + 1]) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleBackspace = (index) => {
    const newOtp = [...otp];
    newOtp[index] = '';
    setOtp(newOtp);

    // Move focus to the previous input on backspace if available
    if (index > 0 && inputRefs[index - 1]) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const otpValue = otp.join('');
    console.log('OTP Value Before API Call:', otpValue);
  
    try {
      const responseData = await verifyOtp.verifyOtp(email, otpValue);
      console.log('API Response:', responseData.message);
  
      if (responseData && (responseData.success || responseData.message === "OTP verified successfully.")) {
        console.log("OTP verified successfully.");
        setOtpError(false); // Reset error state on success
        navigation.replace('OTPSuccess', { email, otpValue });
      } else {
        setOtpError(true); // Set error state on failure
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setOtpError(true); // Set error state on exception
    } finally {
      setIsLoading(false);
    }
  };

  const ResendOtp = async () => {
    try {
      const responseData = await resetPasswordOtp.resetPasswordOTP(email);
      console.log("API Response:", responseData.message);

      if (responseData && (responseData.success || responseData.message === "OTP sent to your email.")) {
        Alert.alert("OTP Resent", "A new OTP has been sent to your email.");
        startCountdown(); // Restart countdown after resending OTP
      } else {
        console.warn("Failed to resend OTP:", responseData?.error || 'Unknown error');
        Alert.alert("Resend Failed", responseData?.error || 'Unable to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error("Error sending reset password OTP:", error);
      Alert.alert("Error", "An error occurred while resending the OTP. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AnimatedBackground>
      <View style={styles.backButtoncontainer}>
        <View style={styles.button}>
        <BackButton goBack={navigation.goBack}></BackButton>
        </View>
      </View>
      {/* <BackButton goBack={navigation.goBack} /> */}
      
      <Text style={styles.header}>OTP Verification</Text>
      <Text style={styles.subHeader}>We have sent the verification code to your email.</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <OTPInput
            key={index}
            index={index}
            value={digit}
            onChange={handleInputChange}
            onBackspace={handleBackspace}
            nextInputRef={inputRefs[index + 1]} // Pass the next input ref
            ref={inputRefs[index]} // Assign ref for each input
            style={otpError ? styles.errorInput : {}} // Apply error style if invalid
          />
        ))}
      </View>
      {otpError && <Text style={styles.errorMessage}>Wrong or Invalid OTP</Text>}

      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Verifying...' : 'Submit'}</Text>
      </Button>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Didn't receive the code?</Text>
        {countdown > 0 ? (
          <Text style={styles.timerText}>{formatTime(countdown)}</Text>
        ) : (
          <TouchableOpacity onPress={ResendOtp}>
            <Text style={styles.resendOtp}> Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#7B61FF",
    textAlign: "left",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    color: "#000",
    textAlign: "left",
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#7B61FF",
    borderRadius: 24,
    height: 58,
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  footer: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "center",
  },
  footerText: {
    fontSize: 18,
  },
  resendOtp: {
    color: "#0068C8",
    fontSize: 18,
    marginLeft: 5,
  },
  timerText: {
    fontSize: 18,
    color: "#0068C8",
    marginLeft: 5,
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
  errorInput: {
    borderColor: 'red', // Change border color to red
    borderWidth: 2, // Set border width
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: '-10',
  },
});
