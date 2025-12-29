// index.tsx
import CardWishlist from '@/components/Card';
import ModalComponent from '@/components/Modal';
import { useWishlistStore, WishlistItem } from '@/store/useWishlistStore';
import { useTheme } from '@/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import "expo-router/entry";
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [visible, setVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const router = useRouter();
  const { wishlists, deleteWishlist, loading, fetchWishlists, error, clearError, setActiveId } = useWishlistStore();
  const { isDarkMode, toggleTheme } = useTheme();

  // 🔹 Fetch wishlists from Supabase on mount
  useEffect(() => {
    fetchWishlists();
  }, []);

  // Filter wishlists berdasarkan search query (tanpa deskripsi)
  const filteredWishlists = useMemo(() => {
    if (!searchQuery.trim()) {
      return wishlists;
    }

    const query = searchQuery.toLowerCase().trim();
    return wishlists.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.price.toLowerCase().includes(query)
    );
  }, [wishlists, searchQuery]);

  const handleAdd = () => {
    setEditingItem(null);
    setVisible(true);
  };

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setVisible(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Wishlist",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWishlist(id);
              Alert.alert("Success", "Item deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete item. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleCloseModal = () => {
    setVisible(false);
    setEditingItem(null);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseInt(price);
    return isNaN(numericPrice) ? '0' : numericPrice.toLocaleString('id-ID');
  };

  const theme = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "white",
    text: isDarkMode ? "#fff" : "#333",
    subtext: isDarkMode ? "#aaa" : "#666",
    fab: "#007AFF",
    border: isDarkMode ? "#333" : "#f0f0f0",
    surfaceAlt: isDarkMode ? "#222" : "#f8f8f8",
    inputBackground: isDarkMode ? "#2a2a2a" : "#fff",
    inputBorder: isDarkMode ? "#444" : "#ddd",
    inputText: isDarkMode ? "#fff" : "#333",
    placeholder: isDarkMode ? "#888" : "#999",
  };

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          isSearchFocused && styles.searchInputContainerFocused
        ]}>
          <Ionicons
            name="search"
            size={20}
            color={theme.placeholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or price..."
            placeholderTextColor={theme.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="done"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              // Optional: handle search submission
              setIsSearchFocused(false);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              <Ionicons name="close-circle" size={20} color={theme.placeholder} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results Info */}
      {searchQuery.length > 0 && (
        <View style={styles.searchInfoContainer}>
          <Text style={styles.searchInfoText}>
            {filteredWishlists.length} result{filteredWishlists.length !== 1 ? 's' : ''} found for "{searchQuery}"
          </Text>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty States */}
      {filteredWishlists.length === 0 ? (
        <View style={styles.emptyState}>
          {searchQuery.length > 0 ? (
            <>
              <Ionicons name="search-outline" size={64} color={theme.subtext} />
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySubtext}>
                Try different keywords or clear your search
              </Text>
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={handleClearSearch}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Ionicons name="heart-outline" size={64} color={theme.subtext} />
              <Text style={styles.emptyText}>Your wishlist is empty</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first item
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredWishlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                // Tambahkan pengecekan fokus search
                if (isSearchFocused) {
                  setIsSearchFocused(false);
                  return;
                }
                const { setActiveId } = useWishlistStore.getState();
                setActiveId(item.id);
                // Navigate to the detail tab
                router.navigate('/(tabs)/detail/index');
              }}
            >
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
          keyboardShouldPersistTaps="handled"
          // Tambahkan prop berikut untuk mencegah keyboard tertutup
          onScrollBeginDrag={() => {
            if (isSearchFocused) {
              setIsSearchFocused(false);
            }
          }}
        />
      )}

      {/* FAB Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.fab }]}
        onPress={handleAdd}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal */}
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

  // Search Bar Styles
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInputContainerFocused: {
    borderColor: theme.fab,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.inputText,
    paddingVertical: 4,
    // Important: prevent keyboard issues
    includeFontPadding: false,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },

  // Search Info
  searchInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.surfaceAlt,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchInfoText: {
    fontSize: 14,
    color: theme.subtext,
    flex: 1,
  },
  clearSearchText: {
    fontSize: 14,
    color: theme.fab,
    fontWeight: '600',
  },

  // Empty States
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
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: theme.fab,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  clearSearchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // List
  listContent: {
    padding: 8,
  },

  // Loading
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

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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