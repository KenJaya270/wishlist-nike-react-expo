// index.tsx
import CardWishlist from '@/components/Card';
import ModalComponent from '@/components/Modal';
import { useWishlistStore, WishlistItem } from '@/store/useWishlistStore';
import { useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  const router = useRouter();

  const {wishlists, deleteWishlist, loading} = useWishlistStore();

  const handleAdd = () => {
    setEditingItem(null);
    setVisible(true);
  }

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Wishlist",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteWishlist(id)
        }
      ]
    );
  };

  const handleCloseModal = () => {
    setVisible(false);
    setEditingItem(null);
  };

  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString('id-ID');
  };

  const {isDarkMode, toggleTheme} = useTheme();

  const theme = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "white",
    text: isDarkMode ? "#fff" : "#333",
    subtext: isDarkMode ? "#aaa" : "#666",
    fab: "#007AFF",
    border: isDarkMode ? "#333" : "#f0f0f0",
    surfaceAlt: isDarkMode ? "#222" : "#f8f8f8",
  };

  // buat styles dinamis — useMemo untuk performa
  const styles = useMemo(() => getStyles(theme), [theme]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.fab} />
          <Text style={styles.loadingText}>Loading wishlists...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>

        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {wishlists.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={theme.subtext} />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first item
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push({
              pathname: '/detail/[id]',
              params: { id: item.id }
            })}>

              <CardWishlist
                item={{
                  ...item,
                  price: formatPrice(item.price)
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.fab }]}
        onPress={handleAdd}
      >
        <Ionicons name="add" size={24} color="white"/>
      </TouchableOpacity>

      <ModalComponent 
        visible={visible}
        onClose={handleCloseModal}
        editItem={editingItem}
      />

    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  themeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: theme.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.subtext,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: theme.subtext,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
  },
  listContent: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    // backgroundColor sekarang di-set inline agar mudah override
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
