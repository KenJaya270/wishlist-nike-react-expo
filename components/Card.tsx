import { WishlistItem } from "@/store/useWishlistStore";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardWishlistProps {
    item: WishlistItem;
    onEdit: (item: WishlistItem) => void;
    onDelete: (id: string) => void;
}


export default function CardWishlist({ item, onEdit, onDelete }: CardWishlistProps){

    const handleDelete = () => {
        onDelete(item.id);
    };

    const handleEdit = () => {
        onEdit(item);
    }

    return (
        <View style={styles.card}>
            <Image 
                source={ {uri: item.image}}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>Rp {item.price},00</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={handleEdit}
                    >
                        <Ionicons name="pencil" size={24} color="white"/>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash" size={16} color="#ff3b30" />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 350,
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        gap: 4,
    },
    editButton: {
        backgroundColor: '#f0f8ff',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#fff0f0',
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    editButtonText: {
        color: '#007AFF',
        fontSize: 12,
        fontWeight: '600',
    },
    deleteButtonText: {
        color: '#ff3b30',
        fontSize: 12,
        fontWeight: '600',
    },
});