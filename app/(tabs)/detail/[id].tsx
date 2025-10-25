import { useWishlistStore } from "@/store/useWishlistStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
    
    // Get wishlist item
    const item = getWishlist(id as string);

    // Format price
    const formatPrice = (price: string) => {
        return `Rp ${parseInt(price).toLocaleString('id-ID')}`;
    };

    // Loading or not found state
    if (!item) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detail</Text>
                    <View style={styles.placeholder} />
                </View>
                
                <View style={styles.notFoundContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
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
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Wishlist</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Image Container */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                </View>

                {/* Content Card */}
                <View style={styles.detailCard}>
                    {/* Title */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Item Name</Text>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>

                    {/* Price */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Price</Text>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    </View>

                    {/* Image URL */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Image URL</Text>
                        <Text style={styles.imageUrl} numberOfLines={2}>
                            {item.image}
                        </Text>
                    </View>

                    {/* Item ID */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Item ID</Text>
                        <Text style={styles.itemId}>{item.id}</Text>
                    </View>
                </View>

            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#e0e0e0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    detailCard: {
        backgroundColor: 'white',
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
        color: '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 32,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    imageUrl: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'monospace',
    },
    itemId: {
        fontSize: 14,
        color: '#999',
        fontFamily: 'monospace',
    },
    actionContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    shareButton: {
        borderColor: '#007AFF',
        backgroundColor: '#F0F8FF',
    },
    shareButtonText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 14,
    },
    favoriteButton: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    favoriteButtonText: {
        color: '#FF3B30',
        fontWeight: '600',
        fontSize: 14,
    },
    bottomSpacing: {
        height: 100,
    },
    bottomButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    backButtonLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    notFoundText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    backToHomeButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backToHomeText: {
        color: 'white',
        fontWeight: '600',
    },
});