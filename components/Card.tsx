// Card.tsx
import { WishlistItem } from "@/store/useWishlistStore";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardWishlistProps {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
}

export default function CardWishlist({ item, onEdit, onDelete }: CardWishlistProps) {
  const { isDarkMode } = useTheme();

  const theme = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "white",
    text: isDarkMode ? "#fff" : "#333",
    subtext: isDarkMode ? "#aaa" : "#666",
    accent: isDarkMode ? "#4da6ff" : "#007AFF",
    border: isDarkMode ? "#333" : "#e6e6e6",
    surfaceAlt: isDarkMode ? "#242424" : "#f0f0f0",
  };

  const styles = useMemo(() => getStyles(theme), [isDarkMode]);

  const handleDelete = () => onDelete(item.id);
  const handleEdit = () => onEdit(item);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Rp {item.price},00</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="pencil" size={16} color={theme.accent} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={14} color="#ff3b30" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      margin: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.border,
    },
    image: {
      width: "100%",
      height: 250,
      backgroundColor: theme.border,
    },
    contentContainer: {
      padding: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.text,
    },
    price: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.accent,
      marginBottom: 8,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      gap: 8,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.accent,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      gap: 8,
      backgroundColor: theme.surfaceAlt,
      borderWidth: 1,
      borderColor: "#ff3b30",
      marginLeft: 8,
    },
    editButtonText: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: "600",
    },
    deleteButtonText: {
      color: "#ff3b30",
      fontSize: 12,
      fontWeight: "600",
    },
  });
