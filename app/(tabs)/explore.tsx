import { Image } from "expo-image";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { ImageEditor } from "expo-dynamic-image-crop";

export default function ExploreScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempImage(result.assets[0].uri);
        setIsEditing(true);
      }
    } catch (e) {
      Alert.alert("Error", "Could not pick image.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Camera permission is required to take a photo."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempImage(result.assets[0].uri);
        setIsEditing(true);
      }
    } catch (e) {
      Alert.alert("Error", "Could not take photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditingComplete = (imageData: { uri: string }) => {
    setImage(imageData.uri);
    setIsEditing(false);
  };

  const handleEditingCancel = () => {
    setImage(tempImage);
    setTempImage(null);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fixed Aspect Ratio Cropping Demo</Text>
      <Text style={styles.description}>
        Select an image from your gallery or take a new picture to get started.
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={pickImage}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Select from gallery"
          activeOpacity={0.8}
        >
          <Feather
            name="image"
            size={22}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={takePhoto}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Take a picture"
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="photo-camera"
            size={24}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <View style={styles.imageCard}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="contain"
            accessibilityLabel="Selected image preview"
          />
        </View>
      )}
      <ImageEditor
        imageUri={tempImage}
        isVisible={isEditing}
        onEditingCancel={handleEditingCancel}
        onEditingComplete={handleEditingComplete}
        fixedAspectRatio={1 / 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
    maxWidth: 320,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 36,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 130,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  imageCard: {
    width: 260,
    height: 260,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
