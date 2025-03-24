import React from "react";
import { View, Text } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { theme } from "../../core/theme";
import styles from "./styles";

const TextInput = React.forwardRef(({ errorText, description, right, variant, ...props }, ref) => {
  const inputStyle = variant === 'map' ? styles.mapInput : styles.input;

  return (
    <View style={styles.container}>
      <PaperTextInput
        ref={ref}
        style={inputStyle}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        right={right ? <PaperTextInput.Icon icon={() => right} /> : null}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
});

export default TextInput;
