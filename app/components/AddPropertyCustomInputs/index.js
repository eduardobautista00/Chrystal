import React, { useState } from "react";
import { View, Text } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { theme } from "../../core/theme";
import styles from "./styles";

export default function AddPropertyCustomInputs({ 
  errorText, 
  description, 
  latitude, 
  longitude, 
  price, 
  area,
  currency,
  unit, 
  onLatitudeChange, 
  onLongitudeChange, 
  onPriceChange, 
  onAreaChange,
  onCurrencyChange,
  onUnitChange,
  latitudeStyle,
  longitudeStyle,
  latitudeProps,
  longitudeProps,
 }) {

  return (
    <View style={styles.container}>
      {/* Latitude and Longitude Inputs */}
      <View style={[styles.row, { display: 'none' }]}>
        {/* Latitude Input */}
        <PaperTextInput
          style={[styles.inputContainer, styles.halfWidth, styles.disabledInput]} // Apply width styling for half size
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Latitude"
          keyboardType="numeric" // Ensure numeric input
          value={latitude} // Bind the value for latitude
          onChangeText={onLatitudeChange} // Ensure changes propagate to parent component
          {...latitudeProps} // Spread additional props here
        />
        {/* Longitude Input */}
        <PaperTextInput
          style={[styles.inputContainer, styles.halfWidth, styles.disabledInput]} // Apply width styling for half size
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Longitude"
          keyboardType="numeric" // Ensure numeric input
          value={longitude} // Bind the value for longitude
          onChangeText={onLongitudeChange} // Ensure changes propagate to parent component
          {...longitudeProps} // Spread additional props here
        />
      </View>

      {/* Price Input Row */}
      <View style={styles.row}>
        <View style={styles.borderedPicker}>
          <Picker
            selectedValue={currency}
            onValueChange={(itemValue) => onCurrencyChange(itemValue)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="$" value="USD" />
            <Picker.Item label="€" value="EUR" />
            <Picker.Item label="¥" value="YEN" />
          </Picker>
        </View>
        <PaperTextInput
          style={[styles.inputContainer, styles.fourthWidth]}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Price"
          keyboardType="numeric"
          value={price} // Bind the value for price
          onChangeText={onPriceChange} // Ensure changes propagate to parent component
        />
      </View>

      {/* Area Input Row */}
      <View style={styles.row}>
        <View style={styles.borderedPicker}>
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => onUnitChange(itemValue)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="km²" value="km2" />
            <Picker.Item label="ft²" value="ft2" />
            <Picker.Item label="acre" value="acre" />
          </Picker>
        </View>
        <PaperTextInput
          style={[styles.inputContainer, styles.fourthWidth]}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Area"
          keyboardType="numeric"
          value={area} // Bind the value for area
          onChangeText={onAreaChange} // Ensure changes propagate to parent component
        />
      </View>

      {/* Error or description message */}
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}
