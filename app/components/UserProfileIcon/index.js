import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './styles';

export default function UserProfileIcon({ imageUri, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.profileContainer}>
      {imageUri ? ( // Check if imageUri is provided
        <Image source={{ uri: imageUri }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderContainer}> {/* Optional: Provide a placeholder */}
          <Text style={styles.placeholderText}>No Image</Text> {/* Use Text to indicate no image */}
        </View>
      )}
    </TouchableOpacity>
  );
}
