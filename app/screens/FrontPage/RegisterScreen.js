import React, { useState } from "react";
import { Platform, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import AnimatedBackground from "../../components/AnimatedBackground";
import BackButton from "../../components/BackButton";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import { theme } from "../../core/theme";

export default function RegisterScreen({ navigation }) {
  const [selectedAccountType, setSelectedAccountType] = useState(null);

  const handleAccountSelection = (accountType) => {
    setSelectedAccountType(accountType);
    navigation.navigate('CreateAccountScreen', { accountType });
  };

  const handleAccountSelectionAgent = (accountType) => {
    setSelectedAccountType(accountType);
    navigation.navigate('SubscriptionScreen', { accountType });
  };

  return (
    <AnimatedBackground>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      <Text style={styles.header}>Register</Text>
      <Text style={styles.subHeader}>Choose an account to register.</Text>
      <Button
        mode="contained"
        onPress={() => handleAccountSelection('Buyer')}
        style={styles.accountButton}
      >
        <Text style={styles.buttonText}>Buyer</Text>
      </Button>
      <Button
        mode="contained"
        onPress={() => handleAccountSelectionAgent('Agent')}
        style={styles.accountButton}
      >
        <Text style={styles.buttonText}>Agent</Text>
      </Button>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => navigation.replace("LoginScreen", { someParam: "yourValue" })}
        >
          <Text style={styles.loginLink}>LOGIN</Text>
        </TouchableOpacity>
      </View>
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
  },
  accountButton: {
    backgroundColor: "#7B61FF",
    borderRadius: 50,
    height: 60,
    justifyContent: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#7B61FF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 18,
  },
  loginLink: {
    fontWeight: "regular",
    color: "#0068C8",
    fontSize: 18,
    marginLeft: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 19,
  },
});
