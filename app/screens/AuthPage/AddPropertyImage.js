import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AnimatedBackground from "../../components/AnimatedBackground";
import BackButton from "../../components/BackButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useData } from "../../context/DataContext";

export default function AddPropertyImageScreen({ route }) {
  const { property } = useData();
  const navigation = useNavigation();
  const { sanitizedData } = route.params;

  const [selectedImage, setSelectedImage] = useState("https://chrystal.seqinstitute.com/storage/images_url/2pE1Je4mXtaGZ7HgPXLe4L1UGdxoWyoBikpuOR4e.jpg");
  const [imageUri, setImageUri] = useState("https://chrystal.seqinstitute.com/storage/images_url/2pE1Je4mXtaGZ7HgPXLe4L1UGdxoWyoBikpuOR4e.jpg");
  const [loading, setLoading] = useState(false);

  const uriToFile = async (uri, fileName) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error("Error converting URI to File:", error);
      throw error;
    }
  };

  const handleFileUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "You need to allow access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        const imageFile = await uriToFile(selectedImageUri, "property_image.jpg");
        setSelectedImage(imageFile);
        setImageUri(selectedImageUri);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while selecting the image.");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert("No Image Selected", "Please upload a property image.");
      return;
    }
  
    try {
      const formDataToSubmit = new FormData();
  
      // Append the image file
      //formDataToSubmit.append("image_url", selectedImage);
      formDataToSubmit.append('image_url', {
        uri: imageUri, // The URI of the image
        type: selectedImage.type || 'image/jpeg', // The MIME type of the image
        name: selectedImage.name || 'property_image',
      });
      // Flatten seller information and append it as top-level fields
      const { seller, ...restData } = sanitizedData;
      Object.keys(restData).forEach((key) => {
        formDataToSubmit.append(key, restData[key]);
      });
  
      Object.keys(seller).forEach((key) => {
        formDataToSubmit.append(key, seller[key]);
      });
  
      // Debugging: Log the transformed FormData
      console.log("FormData being sent to the API:");
      for (const [key, value] of formDataToSubmit.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await property.addProperty(formDataToSubmit);
  
      if (response) {
        Alert.alert("Success", "Your property details have been submitted.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to add property. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the form.");
      console.error("Submission error:", error);
    }
  };
  
  
  
  

  return (
    <AnimatedBackground>
      <View style={styles.backButtonContainer}>
        <BackButton goBack={navigation.goBack} />
      </View>

      <Text style={styles.title}>Add Property</Text>
      <Text style={styles.subtitle}>Provide the information of the property.</Text>

      <View style={styles.uploadContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Text style={styles.uploadText}>Upload Property Images</Text>
          <MaterialCommunityIcons name="cloud-upload-outline" size={100} color="#5D3FD3" />
          <Text style={styles.uploadInstruction}>
            Please <Text style={styles.uploadLink}>Choose File</Text> to upload
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imagePreviewContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.noImageText}>No image selected.</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5D3FD3" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  backButtoncontainer: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D3FD3",
    textAlign: "flex-start",
    marginTop: 100,
  },
  subtitle: {
    fontSize: 16,
    color: "#808080",
    textAlign: "flex-start",
    marginVertical: 10,
  },
  uploadContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  uploadButton: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#5D3FD3",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5D3FD3",
    marginTop: 10,
  },
  uploadInstruction: {
    fontSize: 14,
    color: "#808080",
    marginTop: 5,
  },
  uploadLink: {
    color: "#5D3FD3",
    textDecorationLine: "underline",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    //marginVertical: 0,
  },
  imagePreview: {
    width: 300,
    height: 175,
    borderRadius: 10,
    margin: 5,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: "#5D3FD3",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  noImageText: {
    color: "#808080",
    textAlign: "center",
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
});
