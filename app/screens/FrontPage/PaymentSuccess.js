import React from 'react';
import { View, StyleSheet } from 'react-native';
import SuccessImage from '../../components/SuccessImage'; // New component for the image
import MessageText from '../../components/MessageText'; // New component for the message text
import Button from '../../components/Button'; // Reuse the button component from LoginScreen
import FrontpageLayout from '../../layout/Frontpage';
import AnimatedBackground from '../../components/AnimatedBackground';

export default function OTPSuccessScreen({ route, navigation }) {
  const { accountType } = route.params; // Get account type from route params

  const handleOkayPress = async () => {
    // Always navigate to CreateAccountScreen and pass the accountType
    navigation.navigate('AgentRegistrationScreen', { accountType });
    console.log(accountType);
  };

  return (
      <AnimatedBackground>
        <View>
          {/* Success Image */}
          <SuccessImage source={require('../../../assets/items/check.png')} />
          
          {/* Message Text */}
          <MessageText text={`Payment\nSuccessful`} />

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
});
