import React, { useState, useLayoutEffect, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AnimatedBackground from '../../components/AnimatedBackground';
import BackButton from "../../components/BackButton";
import Button from '../../components/Button';
import TextInput from '../../components/TextInput'; // Reuse TextInput
import { theme } from '../../core/theme'; // Ensure to use consistent theme
import { useData } from '../../context/DataContext';

export default function NewPasswordScreen({ route, navigation }) {
  const [password, setNewPassword] = useState({ value: '', error: '' });
  const [password_confirmation, setConfirmPassword] = useState({ value: '', error: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { email, otpValue } = route.params;
  const { resetPassword } = useData();

  console.log(email);
  console.log(otpValue);
  
  const handleSubmit = async () => {
    setError(''); // Reset any previous error
    setConfirmPasswordError(''); // Reset confirm password error

    // Validate passwords
    if (password.value.length === 0) {
      setError('Password cannot be empty.');
      return;
    }

    if (password.value.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password.value !== password_confirmation.value) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    try {
     const otp = otpValue;
    // Call resetPassword function
    const responseData = await resetPassword.resetPassword(email, otp, password.value, password_confirmation.value);

      if (responseData && (responseData.success || responseData.message === "Password reset successfully.")) {
        console.log("OTP verified successfully.");
        navigation.replace('PasswordResetSuccess');
      } else {
        Alert.alert('Verification Failed', responseData.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      Alert.alert('Verification Failed', 'An error occurred. Please try again.');
    } finally {
      //setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    // Optional: Handle side effects if needed
  }, []);

  useEffect(() => {
    console.log('NewPasswordScreen loaded');
  }, []);

  return (
      <AnimatedBackground>
        <View style={styles.backButtoncontainer}>
        <View>
        <BackButton goBack={navigation.goBack}></BackButton>
        </View>
      </View>
        {/* <BackButton goBack={navigation.goBack} /> */}
        {/* Title Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subHeader}>
            You can now enter your new password.
          </Text>
        </View>

        {/* Input Fields */}
        <TextInput
          label="New Password"
          secureTextEntry={!passwordVisible}
          value={password.value}
          onChangeText={(text) => setNewPassword({ value: text, error: '' })}
          style={styles.input}
          error={!!error}
          errorText={error}

          right={
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          }
        />
        <TextInput
          label="Confirm Password"
          secureTextEntry={!confirmPasswordVisible}
          value={password_confirmation.value}
          onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
          style={styles.input}
          error={!!confirmPasswordError}
          errorText={confirmPasswordError}
          right={
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Icon
                name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
          }
        />

        {/* Error Message */}
        {/*error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Submit Button */}
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#7B61FF',
    textAlign: 'left',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'left',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: -10,
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#7B61FF',
    borderRadius: 30,
    height: 48,
    justifyContent: 'center',
    marginTop: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
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
