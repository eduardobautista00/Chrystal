import React from 'react';
import { View, Text } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { theme } from '../../core/theme'; // Import your theme if needed
import styles from './styles'; // Import styles from styles.js

export default function PhoneInput({ phone, setPhone, error, description  }) {
    const countryCodes = [
        { label: '🇵🇭 PH +63', value: '+63' },
        { label: '🇺🇸 US +1', value: '+1' },
        { label: '🇬🇧 UK +44', value: '+44' },
        { label: '🇦🇺 AU +61', value: '+61' },
        { label: '🇩🇪 DE +49', value: '+49' },
        { label: '🇫🇷 FR +33', value: '+33' },
        { label: '🇯🇵 JP +81', value: '+81' },
        { label: '🇨🇳 CN +86', value: '+86' },
        { label: '🇮🇳 IN +91', value: '+91' },
        { label: '🇿🇦 ZA +27', value: '+27' },
        { label: '🇰🇷 KR +82', value: '+82' },
        { label: '🇮🇹 IT +39', value: '+39' },
        { label: '🇪🇸 ES +34', value: '+34' },
        { label: '🇧🇷 BR +55', value: '+55' },
        { label: '🇲🇾 MY +60', value: '+60' },
        { label: '🇮🇩 ID +62', value: '+62' },
        { label: '🇨🇭 CH +41', value: '+41' },
        { label: '🇮🇪 IE +353', value: '+353' },
        { label: '🇵🇹 PT +351', value: '+351' },
        { label: '🇬🇷 GR +30', value: '+30' },
        { label: '🇸🇪 SE +46', value: '+46' },
        { label: '🇳🇴 NO +47', value: '+47' },
        { label: '🇩🇰 DK +45', value: '+45' },
        { label: '🇳🇱 NL +31', value: '+31' },
        { label: '🇳🇿 NZ +64', value: '+64' },
        { label: '🇴🇲 OM +968', value: '+968' },
        { label: '🇧🇭 BH +973', value: '+973' },
        { label: '🇰🇼 KW +965', value: '+965' },
        { label: '🇶🇦 QA +974', value: '+974' },
        { label: '🇦🇪 AE +971', value: '+971' },
        { label: '🇾🇪 YE +967', value: '+967' },
        { label: '🇪🇬 EG +20', value: '+20' },
        { label: '🇱🇰 LK +94', value: '+94' },
    ];

    const handlePhoneChange = (text) => {
        const fullValue = `${phone.countryCode}${text}`;
            console.log('Full Phone Value:', fullValue);
        // Update the phone value and also the combined value
        setPhone({
            ...phone,
            value: text,
            fullValue, // Create a combined value
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.phoneInputContainer}>
                <View style={[styles.countryCodePicker, error && styles.errorBorder]}>
                    <RNPickerSelect
                        onValueChange={(value) => {
                            const fullValue = `${value}${phone.value}`; // Update fullValue when country code changes
                            console.log('Country Code Selected:', value); // Log the selected country code
                            console.log('Full Phone Value:', fullValue); // Log the full value after country code change

                            setPhone({
                                ...phone,
                                countryCode: value,
                                fullValue, // Update the combined value
                            });
                        }}
                        items={countryCodes}
                        style={{
                            ...pickerSelectStyles,
                            inputIOS: [pickerSelectStyles.inputIOS, error && { borderColor: 'red' }],
                            inputAndroid: [pickerSelectStyles.inputAndroid, error && { borderColor: 'red' }],
                        }}
                        value={phone.countryCode || '+63'} // Default to Philippines
                        placeholder={{
                            label: '🇵🇭 PH +63',
                            value: '+63',
                            color: 'gray',
                        }}
                        
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
                <View style={[styles.phoneNumberContainer, error && styles.errorBorder]}>
                    <PaperTextInput
                        style={styles.phoneNumberInput}
                        label="Phone Number"
                        selectionColor={theme.colors.primary}
                        underlineColor="transparent"
                        mode="outlined"
                        value={phone.value}
                        onChangeText={handlePhoneChange} // Call the handler here
                        keyboardType="phone-pad"
                        error={!!error}
                    />
                </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        color: 'black',
        padding: 12,
    },
    inputAndroid: {
        fontSize: 16,
        color: 'black',
    },
    placeholder: {
        color: 'black',
    },
};

