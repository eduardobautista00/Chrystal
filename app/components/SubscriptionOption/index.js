import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "./styles";

export default function SubscriptionOption({ value, selectedValue, onValueChange, title, details, price }) {
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      onPress={() => onValueChange(value)}
      style={[
        styles.planOption,
        isSelected && styles.selectedOption, // Apply selected background and border color
      ]}
    >
      <RadioButton
        value={value}
        status={isSelected ? "checked" : "unchecked"}
        onPress={() => onValueChange(value)}
        uncheckedColor={styles.uncheckedColor.color}
        color={styles.checkedColor.color}
      />
      <View style={styles.planText}>
        <Text style={styles.planTitle}>{title}</Text>
        {details.map((detail, index) => (
          <Text key={index} style={styles.planDetails}>
            {detail}
          </Text>
        ))}
        <Text style={styles.planPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}
