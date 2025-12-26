import { useWishlistStore } from "@/store/useWishlistStore";
import { useTheme } from "@/theme/ThemeContext";
import { makeDeepLink } from "@/utils/deeplink";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Detail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { getWishlist, fetchWishlistById, loading } = useWishlistStore();
  const { isDarkMode } = useTheme();

  // Pastikan ID selalu string
  const initialId =
    Array.isArray(params.id) ? params.id[0] : params.id ?? undefined;

  const [itemId, setItemId] = useState<string | undefined>(initialId);
  const [item, setItem] = useState<any>(null);
  const [fetchingItem, setFetchingItem] = useState(false);

  // Handle deep link
  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const parsed = Linking.parse(event.url);

      // PRIORITAS 1 → ambil dari query
      let rawId = parsed.queryParams?.id;
      let id = Array.isArray(rawId) ? rawId[0] : rawId;

      // PRIORITAS 2 → ambil dari pathname (wishlistnike://detail/123)
      if (!id && parsed.path?.includes("/")) {
        id = parsed.path.split("/")[1];
      }

      if (id) {
        setItemId(id);
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);

    return () => sub.remove();
  }, []);

  // 🔹 Fetch item from local cache or Supabase
  useEffect(() => {
    const loadItem = async () => {
      if (!itemId) {
        setItem(null);
        return;
      }

      // Try to get from local cache first
      const localItem = getWishlist(itemId);

      if (localItem) {
        setItem(localItem);
      } else {
        // If not in cache, fetch from Supabase
        setFetchingItem(true);
        try {
          const fetchedItem = await fetchWishlistById(itemId);
          setItem(fetchedItem);
        } catch (error) {
          console.error('Error loading item:', error);
          setItem(null);
        } finally {
          setFetchingItem(false);
        }
      }
    };

    loadItem();
  }, [itemId]);

  // THEME
  const theme = {
    background: isDarkMode ? "#121212" : "#f5f5f5",
    card: isDarkMode ? "#1e1e1e" : "white",
    text: isDarkMode ? "#fff" : "#333",
    subtext: isDarkMode ? "#aaa" : "#666",
    border: isDarkMode ? "#333" : "#f0f0f0",
    accent: "#007AFF",
  };

  const styles = useMemo(() => getStyles(theme), [theme]);

  const formatPrice = (price: string) =>
    `Rp ${parseInt(price).toLocaleString("id-ID")}`;

  // LOADING STATE
  if (fetchingItem || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.notFoundContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={styles.notFoundText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ITEM NOT FOUND UI
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.subtext} />
          <Text style={styles.notFoundText}>Item not found</Text>
          <Text style={styles.notFoundSubtext}>
            This item may have been deleted or the link is invalid
          </Text>

          <TouchableOpacity
            style={styles.backToHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToHomeText}>Back to Wishlist</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // MAIN CONTENT UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Wishlist</Text>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={async () => {
            try {
              const url = makeDeepLink(item.id);
              await Share.share({ message: `Check this item: ${url}` });
            } catch (e) {
              console.warn("Unable to share", e);
            }
          }}
        >
          <Ionicons name="share-social" size={20} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailCard}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Item Name</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Price</Text>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Image URL</Text>
            <Text style={styles.imageUrl} numberOfLines={2}>
              {item.image}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Item ID</Text>
            <Text style={styles.itemId}>{item.id}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES
const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      padding: 8,
      marginLeft: -8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    placeholder: {
      width: 40,
    },
    shareButton: {
      padding: 8,
      marginRight: -8,
    },
    content: {
      flex: 1,
    },
    imageContainer: {
      width: "100%",
      height: 300,
      backgroundColor: theme.border,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    detailCard: {
      backgroundColor: theme.card,
      marginTop: -20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionLabel: {
      fontSize: 12,
      color: theme.subtext,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      lineHeight: 32,
    },
    price: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.accent,
    },
    imageUrl: {
      fontSize: 14,
      color: theme.subtext,
      fontFamily: "monospace",
    },
    itemId: {
      fontSize: 14,
      color: theme.subtext,
      fontFamily: "monospace",
    },
    notFoundContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    notFoundText: {
      fontSize: 18,
      color: theme.subtext,
      marginTop: 16,
      marginBottom: 8,
    },
    notFoundSubtext: {
      fontSize: 14,
      color: theme.subtext,
      textAlign: 'center',
      marginBottom: 24,
      paddingHorizontal: 32,
    },
    backToHomeButton: {
      backgroundColor: theme.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    backToHomeText: {
      color: "white",
      fontWeight: "600",
    },
  });
