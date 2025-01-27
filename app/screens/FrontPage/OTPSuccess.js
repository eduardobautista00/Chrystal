import React from 'react';
import { View, StyleSheet } from 'react-native';
import SuccessImage from '../../components/SuccessImage'; // New component for the image
import MessageText from '../../components/MessageText'; // New component for the message text
import Button from '../../components/Button'; // Reuse the button component from LoginScreen
import FrontpageLayout from '../../layout/Frontpage';
import AnimatedBackground from '../../components/AnimatedBackground';

export default function OTPSuccessScreen({ route, navigation }) {
  const { email, otpValue } = route.params; // Get account type from route params

  const handleOkayPress = async () => {
    navigation.navigate('NewPasswordScreen', {email, otpValue}); // Fallback navigation if accountType is not recognized
    
  };

  return (
      <AnimatedBackground>
        <View style={styles.container}>
          {/* Success Image */}
          <SuccessImage source={require('../../../assets/items/check.png')} />
          
          {/* Message Text */}
          <MessageText text={`Verification\nSuccessful`} style={styles.texts} />
          {/* Okay Button */}
        <Button mode="contained" onPress={handleOkayPress} style={styles.button}>
            Okay!
          </Button>
        </View>
        
      </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 30,
  },
});
