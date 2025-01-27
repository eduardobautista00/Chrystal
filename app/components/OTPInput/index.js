import React, { useRef } from 'react';
import { TextInput } from 'react-native';
import styles from './styles'; // Import styles

// Use React.forwardRef to allow refs from the parent component
const OTPInput = React.forwardRef(({ index, value, onChange, onBackspace, nextInputRef }, ref) => {

  return (
    <TextInput
      ref={ref} // Attach the forwarded ref here
      style={styles.otpInput}
      keyboardType="number-pad" // Numeric keyboard for OTP entry
      maxLength={1} // Restrict input to one character
      autoFocus={index === 0} // Focus on the first input initially
      value={value} // Bind the value of the OTP input
      textContentType="oneTimeCode" // Retains OTP keyboard on iOS
      onChangeText={(text) => {
        onChange(index, text); // Update the OTP state
        if (text && nextInputRef) {
          nextInputRef.current.focus(); // Auto focus on the next input if text is entered
        }
      }}
      onKeyPress={({ nativeEvent }) => {
        if (nativeEvent.key === 'Backspace' && value === '') {
          onBackspace(index); // Clear the field on backspace if empty
        }
      }}
      returnKeyType="next" // 'Next' for moving to the next field
      blurOnSubmit={false} // Prevents the keyboard from closing on submit
    />
  );
});

export default OTPInput;
