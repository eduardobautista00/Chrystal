import React, { useState } from "react";
import { View, Text } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { theme } from "../../core/theme";
import styles from "./styles";
import { useDarkMode } from "../../context/DarkModeContext";

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
  const { isDarkMode } = useDarkMode();

  const inputTheme = {
    colors: {
      ...theme.colors,
      background: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      text: isDarkMode ? '#FFFFFF' : '#000000',
      placeholder: isDarkMode ? '#CCCCCC' : theme.colors.labels,
      primary: theme.colors.primary,
    },
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#1A1A1A' }]}>
      {/* Latitude and Longitude Inputs */}
      <View style={[styles.row, { display: 'none' }]}>
        {/* Latitude Input */}
        <PaperTextInput
          style={[
            styles.inputContainer, 
            styles.halfWidth, 
            styles.disabledInput,
            isDarkMode && { backgroundColor: '#1A1A1A' }
          ]}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Latitude"
          keyboardType="numeric" // Ensure numeric input
          value={latitude} // Bind the value for latitude
          onChangeText={onLatitudeChange} // Ensure changes propagate to parent component
          theme={inputTheme}
          {...latitudeProps} // Spread additional props here
        />
        {/* Longitude Input */}
        <PaperTextInput
          style={[
            styles.inputContainer, 
            styles.halfWidth, 
            styles.disabledInput,
            isDarkMode && { backgroundColor: '#1A1A1A' }
          ]}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Longitude"
          keyboardType="numeric" // Ensure numeric input
          value={longitude} // Bind the value for longitude
          onChangeText={onLongitudeChange} // Ensure changes propagate to parent component
          theme={inputTheme}
          {...longitudeProps} // Spread additional props here
        />
      </View>

      {/* Price Input Row */}
      <View style={styles.row}>
        <View style={[
          styles.borderedPicker, 
          isDarkMode && { 
            borderColor: '#FFFFFF',
            backgroundColor: '#1A1A1A' // Add background color for dark mode
          }
        ]}>
          <Picker
            selectedValue={currency}
            onValueChange={(itemValue) => onCurrencyChange(itemValue)}
            style={[
              styles.picker, 
              { 
                color: isDarkMode ? '#FFFFFF' : '#000000',
                backgroundColor: isDarkMode ? '#1A1A1A' : 'transparent' // Add background color for Picker
              }
            ]}
            dropdownIconColor={isDarkMode ? '#FFFFFF' : '#000000'}
            mode="dropdown"
          >
            <Picker.Item label="$" value="USD" color={isDarkMode ? '#FFFFFF' : '#000000'} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }} />
            <Picker.Item label="€" value="EUR" color={isDarkMode ? '#FFFFFF' : '#000000'} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }} />
            <Picker.Item label="¥" value="JPY" color={isDarkMode ? '#FFFFFF' : '#000000'} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }} />
          </Picker>
        </View>
        <PaperTextInput
          style={[
            styles.inputContainer, 
            styles.fourthWidth,
            isDarkMode && { backgroundColor: '#1A1A1A' }
          ]}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Price"
          keyboardType="numeric"
          maxLength={10}
          maxDecimalPlaces={2}
          value={price} // Bind the value for price
          onChangeText={onPriceChange} // Ensure changes propagate to parent component
          theme={inputTheme}
          textColor={isDarkMode ? '#FFFFFF' : '#000000'}
        />
      </View>

      {/* Area Input Row */}
      <View style={styles.row}>
        <View style={[
          styles.borderedPicker, 
          isDarkMode && { 
            borderColor: '#FFFFFF',
            backgroundColor: '#1A1A1A' // Add background color for dark mode
          }
        ]}>
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => onUnitChange(itemValue)}
            style={[
              styles.picker, 
              { 
                color: isDarkMode ? '#FFFFFF' : '#000000',
                backgroundColor: isDarkMode ? '#1A1A1A' : 'transparent'
              }
            ]}
            dropdownIconColor={isDarkMode ? '#FFFFFF' : '#000000'}
            mode="dropdown"
          >
            <Picker.Item label="m²" value="m2" color={isDarkMode ? '#FFFFFF' : '#000000'} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }} />
            <Picker.Item label="ft²" value="ft2" color={isDarkMode ? '#FFFFFF' : '#000000'} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }} />
            <Picker.Item label="acre" value="acre" color={isDarkMode ? '#FFFFFF' : '#000000'} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }} />
          </Picker>
        </View>
        <PaperTextInput
          style={[
            styles.inputContainer, 
            styles.fourthWidth,
            isDarkMode && { backgroundColor: '#1A1A1A' }
          ]}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          mode="outlined"
          label="Area"
          keyboardType="numeric"
          maxLength={10}
          maxDecimalPlaces={2}
          value={area} // Bind the value for area
          onChangeText={onAreaChange} // Ensure changes propagate to parent component
          theme={inputTheme}
          textColor={isDarkMode ? '#FFFFFF' : '#000000'}
        />
      </View>

      {/* Error or description message */}
      {description && !errorText ? (
        <Text style={[styles.description, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {description}
        </Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}
