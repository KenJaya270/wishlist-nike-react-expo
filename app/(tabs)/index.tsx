//index.tsx
import CardWishlist from '@/components/Card';
import ModalComponent from '@/components/Modal';
import { useWishlistStore, WishlistItem } from '@/store/useWishlistStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
    console.log('Add button pressed');
    setEditingItem(null);
    setVisible(true);
    console.log('visible state should be true now:', true);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading wishlists...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <Text style={styles.headerSubtitle}>
          {wishlists.length} items in wishlist
        </Text>
      </View>

      {wishlists.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
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
        style={styles.fab}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
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
})
