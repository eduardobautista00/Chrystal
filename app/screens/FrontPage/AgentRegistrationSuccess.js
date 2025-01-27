import React from 'react';
import { View, StyleSheet } from 'react-native';
import SuccessImage from '../../components/SuccessImage'; // New component for the image
import MessageText from '../../components/MessageText'; // New component for the message text
import Button from '../../components/Button'; // Reuse the button component from LoginScreen
import { Text } from 'react-native-paper';
import FrontpageLayout from '../../layout/Frontpage';
import AnimatedBackground from '../../components/AnimatedBackground';
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext"; // Import useData

export default function AgentRegistrationSuccess({ navigation }) {
  const { authState } = useAuth();
  const { register } = useData();
  const { register_user } = register.registerState;
  
  const handleOkayPress = async () => {
    try {
      // const response = await axios.post('https://chrystal.seqinstitute.com/api/login', {
      //   email: email.value, // Pass the email value as a string
      //   password: password.value, // Pass the password value as a string
      // });

      // console.log('Login successful:', response.data);
      console.log(register_user.email);
      //console.log(register_user.password);
      // Automatically log in using authState

      //await authState.login(register_user.email, register_user.password);
      navigation.replace('LoginScreen', { someParam: 'high 5' }); // Navigate to HomeScreen after login

    } catch (error) {
      // Handle login error
      console.error('Login failed:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'Please try again.');
    }
  };

  return (
      <AnimatedBackground>
        <View>
        {/* Success Image */}
        <SuccessImage source={require('../../../assets/items/check.png')} />
        
        {/* Message Text */}
        <MessageText text={`Your registration has\n been successfully\n submitted.`} />
        <Text style={styles.subHeader}>
        Your registration is currently under review and will be verified within 24 hours.
      </Text>


        {/* Okay Button */}
        <Button mode="contained" onPress={handleOkayPress} style={styles.button}>
          Okay!
        </Button>
      </View>
      </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginTop: 30,
  },
  subHeader: {
    fontSize: 20,
    color: "#000000",
    textAlign: "center", // Align text to the left
    marginBottom: 24,
  },
});
