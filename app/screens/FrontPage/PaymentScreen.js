import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper"; // Using Paper's TextInput for consistency
import AnimatedBackground from "../../components/AnimatedBackground"; // Assuming you have a AnimatedBackground component
import Button from "../../components/Button"; // Assuming you have a button component
import BackButton from "../../components/BackButton";
import { TextInputMask } from 'react-native-masked-text';
import { theme } from "../../core/theme";

export default function PaymentScreen({ route, navigation }) {
  const { accountType } = route.params; // Receive accountType from previous screen
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [errors, setErrors] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    securityCode: "",
  });

  const validateCardDetails = () => {
    let isValid = true;
    let newErrors = {
      nameOnCard: "",
      cardNumber: "",
      expiry: "",
      securityCode: "",
    };

    if (!nameOnCard) {
      newErrors.nameOnCard = "Please enter the name on the card.";
      isValid = false;
    }

    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumber) {
      newErrors.cardNumber = "Please enter the card number.";
      isValid = false;
    } else if (!cardNumberRegex.test(cardNumber)) {
      newErrors.cardNumber = "Invalid card number. It should be 16 digits.";
      isValid = false;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // MM/YY format
    if (!expiry) {
      newErrors.expiry = "Please enter the expiry date.";
      isValid = false;
    } else if (!expiryRegex.test(expiry)) {
      newErrors.expiry = "Invalid expiry date. Use MM/YY format.";
      isValid = false;
    } else {
      // Validate if the expiry date is in the future
      const [month, year] = expiry.split('/');
      const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
      const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)

      // Convert the entered year to a number
      const enteredYear = parseInt(year, 10);
      const enteredMonth = parseInt(month, 10);

      if (enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < currentMonth)) {
        newErrors.expiry = "Expiry date cannot be in the past.";
        isValid = false;
      }
    }

    const securityCodeRegex = /^[0-9]{3,4}$/;
    if (!securityCode) {
      newErrors.securityCode = "Please enter the security code.";
      isValid = false;
    } else if (!securityCodeRegex.test(securityCode)) {
      newErrors.securityCode = "Invalid security code. It should be 3 or 4 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePayment = () => {
    if (validateCardDetails()) {
      // Proceed with payment processing and pass accountType
      navigation.navigate("PaymentSuccess", { accountType });
      console.log(accountType);
    }
  };

  return (
    <AnimatedBackground>
      <BackButton goBack={navigation.goBack} />
      <Text style={styles.header}>Subscription</Text>
      <Text style={styles.subHeader}>Set up your card</Text>

      <TextInput
        label="Name on Card"
        value={nameOnCard}
        onChangeText={(text) => setNameOnCard(text)}
        style={styles.input}
        mode="outlined"
        error={!!errors.nameOnCard}
      />
      {errors.nameOnCard ? <Text style={styles.errorText}>{errors.nameOnCard}</Text> : null}

      <TextInput
        label="Card Number"
        value={cardNumber}
        onChangeText={(text) => setCardNumber(text)}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
        error={!!errors.cardNumber}
      />
      {errors.cardNumber ? <Text style={styles.errorText}>{errors.cardNumber}</Text> : null}

      <View style={styles.row}>
        <View style={styles.row1}>
        <TextInput
          label="Expiry MM/YY"
          value={expiry}
          onChangeText={(text) => setExpiry(text)}
          style={[styles.input, styles.halfInput]}
          mode="outlined"
          keyboardType="alphanumeric"
          error={!!errors.expiry}
        />
          {errors.expiry ? <Text style={styles.errorText}>{errors.expiry}</Text> : null}
        </View>
        <View style={styles.row1}>
          <TextInput
            label="Security Code"
            value={securityCode}
            onChangeText={(text) => setSecurityCode(text)}
            style={[styles.input, styles.halfInput]}
            mode="outlined"
            keyboardType="numeric"
            error={!!errors.securityCode}
          />
          {errors.securityCode ? <Text style={styles.errorText}>{errors.securityCode}</Text> : null}
        </View>
      </View>

      <Button mode="contained" onPress={handlePayment} style={styles.button}>
        Confirm Payment
      </Button>

      <Text style={styles.footer}>Cancel at anytime. No commitment.</Text>
      <View style={styles.secureContainer}>
        <Text style={styles.secureText}>Secure payment</Text>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "left",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "left",
    marginBottom: 20,
  },
  input: {
    marginBottom: 8, // Adjusted to fit error messages
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row1: {
    flexDirection: "column",
    width: "49%",
  },
  halfInput: {
    width: "100%",
    marginBottom: 8, // Adjusted to fit error messages
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginVertical: 30,
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },
  secureContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  secureText: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    textAlign: "left",
  },
});
