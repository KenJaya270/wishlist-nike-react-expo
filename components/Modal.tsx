// Modal.tsx
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
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

  const validateForm = () => {
    const newErrors = { title: "", price: "", image: "" };
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(formData.price))) newErrors.price = "Price must be a number";
    if (!formData.image.trim()) newErrors.image = "Image URL is required";

    setErrors(newErrors);
    return !newErrors.title && !newErrors.price && !newErrors.image;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    try {
      if (editItem) {
        updateWishlist(editItem.id, formData);
        Alert.alert("Success", "Wishlist updated successfully");
      } else {
        addWishlist(formData);
        Alert.alert("Success", "Wishlist added successfully");
      }
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save wishlist");
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image URL *</Text>
              <TextInput
                style={[styles.textInput, errors.image && styles.inputError]}
                placeholder="Masukkan URL gambar"
                placeholderTextColor={theme.subtext}
                autoCapitalize="none"
                value={formData.image}
                onChangeText={(text) => setFormData((p) => ({ ...p, image: text }))}
              />
              {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
            </View>

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
      maxHeight: "80%",
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
