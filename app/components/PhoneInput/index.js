import React from 'react';
import { View, Text } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../core/theme'; // Import your theme if needed
import styles from './styles'; // Import styles from styles.js
import { useDarkMode } from '../../context/DarkModeContext';

export default function PhoneInput({ phone, setPhone, error, description  }) {
    const { isDarkMode } = useDarkMode();
    const countryCodes = [
        { label: '🇺🇸 +1', value: '+1' },
        { label: '🇬🇧 +44', value: '+44' },
        { label: '🇦🇺 +61', value: '+61' },
        { label: '🇩🇪 +49', value: '+49' },
        { label: '🇫🇷 +33', value: '+33' },
        { label: '🇯🇵 +81', value: '+81' },
        { label: '🇨🇳 +86', value: '+86' },
        { label: '🇮🇳 +91', value: '+91' },
        { label: '🇿🇦 +27', value: '+27' },
        { label: '🇰🇷 +82', value: '+82' },
        { label: '🇮🇹 +39', value: '+39' },
        { label: '🇪🇸 +34', value: '+34' },
        { label: '🇧🇷 +55', value: '+55' },
        { label: '🇲🇾 +60', value: '+60' },
        { label: '🇮🇩 +62', value: '+62' },
        { label: '🇨🇭 +41', value: '+41' },
        { label: '🇮🇪 +353', value: '+353' },
        { label: '🇵🇹 +351', value: '+351' },
        { label: '🇬🇷 +30', value: '+30' },
        { label: '🇸🇪 +46', value: '+46' },
        { label: '🇳🇴 +47', value: '+47' },
        { label: '🇩🇰 +45', value: '+45' },
        { label: '🇳🇱 +31', value: '+31' },
        { label: '🇳🇿 +64', value: '+64' },
        { label: '🇴🇲 +968', value: '+968' },
        { label: '🇧🇭 +973', value: '+973' },
        { label: '🇰🇼 +965', value: '+965' },
        { label: '🇶🇦 +974', value: '+974' },
        { label: '🇦🇪 +971', value: '+971' },
        { label: '🇾🇪 +967', value: '+967' },
        { label: '🇪🇬 +20', value: '+20' },
        { label: '🇱🇰 +94', value: '+94' },
    ];

    const handlePhoneChange = (text) => {
        const fullValue = `${phone.countryCode || '+63'}${text}`;
        setPhone({
            ...phone,
            value: text,
            fullValue,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <View style={[styles.pickerContainer, isDarkMode && { borderColor: '#ffffff', borderWidth: 0.5 }, error && styles.errorBorder]}>
                    <Picker
                        mode='dropdown'
                        selectedValue={phone.countryCode || '+63'}
                        onValueChange={(value) => {
                            const fullValue = `${value}${phone.value}`;
                            setPhone({
                                ...phone,
                                countryCode: value,
                                fullValue,
                            });
                        }}
                        style={[
                            styles.picker,
                            {
                                color: isDarkMode ? '#FFFFFF' : '#000000',
                                backgroundColor: isDarkMode ? '#1A1A1A' : 'transparent',
                            },
                        ]}
                        dropdownIconColor={isDarkMode ? '#FFFFFF' : '#000000'}
                    >
                        <Picker.Item 
                            label="🇵🇭 +63" 
                            value="+63" 
                            color={isDarkMode ? '#FFFFFF' : 'gray'}
                            style={isDarkMode && { backgroundColor: '#1a1a1a' }}
                        />
                        {countryCodes.map((country) => (
                            <Picker.Item
                                key={country.value}
                                label={country.label}
                                value={country.value}
                                color={isDarkMode ? '#FFFFFF' : '#000000'}
                                style={isDarkMode && { backgroundColor: '#1a1a1a' }}
                            />
                        ))}
                    </Picker>
                </View>

                <View style={[styles.inputContainer, error && styles.errorBorder]}>
                    <PaperTextInput
                        style={[
                            styles.input,
                            isDarkMode && { 
                                backgroundColor: '#1A1A1A',
                            }
                        ]}
                        label="Phone Number"
                        value={phone.value}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        error={!!error}
                        mode="outlined"
                        theme={{
                            colors: {
                                text: isDarkMode ? '#FFFFFF' : '#000000',
                                placeholder: isDarkMode ? '#FFFFFF' : 'gray',
                                primary: theme.colors.primary,
                                background: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                            }
                        }}
                        textColor={isDarkMode ? '#FFFFFF' : '#000000'}
                        
                    />
                </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

