import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AnimatedBackground from "../../components/AnimatedBackground"; // Assuming you have a AnimatedBackground component
import Button from "../../components/Button"; // Assuming you have a button component
import SubscriptionOption from "../../components/SubscriptionOption"; // Import the custom component
import { theme } from "../../core/theme";
import BackButton from "../../components/BackButton";

export default function SubscriptionScreen({route, navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { accountType } = route.params;

  const subscriptionPlans = [
    {
      value: "free_trial",
      title: "Free trial for 30 days",
      details: ["Individual only"],
      price: "$0.00/month",
    },
    {
      value: "monthly",
      title: "Monthly",
      details: ["Individual only"],
      price: "$149.99/month",
    },
    {
      value: "yearly",
      title: "Yearly",
      details: ["Individual and corporation"],
      price: "$549.99/year",
    },
    {
      value: "lifetime",
      title: "Lifetime",
      details: ["Individual and corporation"],
      price: "$1149.99/one time payment",
    },
  ];

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscription = () => {
    if (!selectedPlan) {
      alert("Please select a subscription plan.");
      return;
    }
    // Navigate to payment or another action
    navigation.navigate("PaymentScreen", { accountType, plan: selectedPlan });
    console.log(accountType);
  };

  return (
    <AnimatedBackground>
      <BackButton goBack={navigation.goBack} />
      <Text style={styles.header}>Subscription</Text>
      <Text style={styles.subHeader}>Choose a plan to subscribe</Text>

      {subscriptionPlans.map((plan) => (
        <SubscriptionOption
          key={plan.value}
          value={plan.value}
          selectedValue={selectedPlan}
          onValueChange={handlePlanChange}
          title={plan.title}
          details={plan.details}
          price={plan.price}
        />
      ))}

      <Button mode="contained" onPress={handleSubscription} style={styles.button}>
        Add to payment method
      </Button>

      <Text style={styles.footer}>Cancel at anytime. No commitment.</Text>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "left",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "left",
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginVertical: 50,
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
});
