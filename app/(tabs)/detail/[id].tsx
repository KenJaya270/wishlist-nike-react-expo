import { useWishlistStore } from "@/store/useWishlistStore";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Detail() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getWishlist } = useWishlistStore();
    const { isDarkMode } = useTheme();

    // Tentukan warna tema (sama konsepnya seperti di index.tsx)
    const theme = {
        background: isDarkMode ? "#121212" : "#f5f5f5",
        card: isDarkMode ? "#1e1e1e" : "white",
        text: isDarkMode ? "#fff" : "#333",
        subtext: isDarkMode ? "#aaa" : "#666",
        border: isDarkMode ? "#333" : "#f0f0f0",
        accent: "#007AFF",
    };

    // Buat styles dinamis berdasarkan theme
    const styles = useMemo(() => getStyles(theme), [theme]);

    const item = getWishlist(id as string);

    const formatPrice = (price: string) => {
        return `Rp ${parseInt(price).toLocaleString("id-ID")}`;
    };

    // Jika item tidak ditemukan
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

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Wishlist</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Gambar */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={(e) =>
                            console.log("Image load error:", e.nativeEvent.error)
                        }
                    />
                </View>

                {/* Konten */}
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

// === Styles Dinamis ===
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
            marginBottom: 24,
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
