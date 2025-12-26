// Modal.tsx
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
  editItem?: WishlistItem | null;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ visible, onClose, editItem }) => {
  const { addWishlist, updateWishlist } = useWishlistStore();
  const { isDarkMode } = useTheme();

  const theme = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "white",
    text: isDarkMode ? "#fff" : "#333",
    subtext: isDarkMode ? "#aaa" : "#666",
    accent: isDarkMode ? "#4da6ff" : "#007AFF",
    border: isDarkMode ? "#333" : "#e6e6e6",
    surfaceAlt: isDarkMode ? "#242424" : "#f9f9f9",
  };

  const styles = useMemo(() => getStyles(theme), [isDarkMode]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    price: "",
    image: "",
  });

  // 🔹 Reset form saat modal dibuka
  useEffect(() => {
    if (visible) {
      if (editItem) {
        setFormData({ title: editItem.title, price: editItem.price, image: editItem.image });
      } else {
        setFormData({ title: "", price: "", image: "" });
      }
      setErrors({ title: "", price: "", image: "" });
    }
  }, [visible, editItem]);

  // 🔹 Fungsi validasi form
  const validateForm = () => {
    const newErrors = { title: "", price: "", image: "" };
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(formData.price))) newErrors.price = "Price must be a number";
    if (!formData.image.trim()) newErrors.image = "Image is required";

    setErrors(newErrors);
    return !newErrors.title && !newErrors.price && !newErrors.image;
  };

  // 🔹 Image Picker Handler
  const pickImage = async () => {
    // Minta izin akses galeri
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "You need to allow access to photos to continue.");
      return;
    }

    // Buka galeri
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [1, 1],
      allowsEditing: true,
    });

    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // 🔹 Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editItem) {
        await updateWishlist(editItem.id, formData);
        Alert.alert("Success", "Wishlist updated successfully");
      } else {
        await addWishlist(formData);
        Alert.alert("Success", "Wishlist added successfully");
      }
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save wishlist. Please try again.");
      console.error(error);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editItem ? "Edit Wishlist" : "Tambah Wishlist Baru"}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color={theme.subtext} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Input Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.textInput, errors.title && styles.inputError]}
                placeholder="Masukkan nama wishlist"
                placeholderTextColor={theme.subtext}
                autoCapitalize="words"
                value={formData.title}
                onChangeText={(text) => setFormData((p) => ({ ...p, title: text }))}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>

            {/* Input Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={[styles.textInput, errors.price && styles.inputError]}
                placeholder="Masukkan harga"
                placeholderTextColor={theme.subtext}
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(text) => setFormData((p) => ({ ...p, price: text }))}
              />
              {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
            </View>

            {/* Image Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gambar *</Text>

              {formData.image ? (
                <Image source={{ uri: formData.image }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color={theme.subtext} />
                  <Text style={{ color: theme.subtext, marginTop: 8 }}>Tidak ada gambar</Text>
                </View>
              )}

              <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                <Ionicons name="camera" size={18} color="white" />
                <Text style={styles.pickButtonText}>Pilih Gambar</Text>
              </TouchableOpacity>

              {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
            </View>

            {/* Tombol Submit */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{editItem ? "Update" : "Simpan"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;

const getStyles = (theme: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    modalContent: {
      width: "100%",
      maxHeight: "85%",
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    closeButton: { padding: 6 },
    formContainer: { padding: 16 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: theme.text },
    textInput: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.surfaceAlt,
      color: theme.text,
      borderColor: theme.border,
    },
    inputError: { borderColor: "#ff3b30" },
    errorText: { color: "#ff3b30", fontSize: 12, marginTop: 4 },
    imagePreview: {
      width: "100%",
      height: 180,
      borderRadius: 8,
      marginBottom: 8,
    },
    imagePlaceholder: {
      width: "100%",
      height: 180,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: theme.surfaceAlt,
    },
    pickButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accent,
      borderRadius: 8,
      paddingVertical: 10,
      gap: 8,
    },
    pickButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 14,
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingTop: 16,
      gap: 12,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 80,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.border,
    },
    submitButton: { backgroundColor: theme.accent },
    cancelButtonText: { color: theme.text, fontWeight: "600" },
    submitButtonText: { color: "white", fontWeight: "600" },
  });
