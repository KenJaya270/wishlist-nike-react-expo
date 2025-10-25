import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ModalComponentProps {
    visible: boolean;
    onClose: () => void;
    editItem?: WishlistItem | null;
}

const ModalComponent: React.FC<ModalComponentProps> = ({visible, onClose, editItem}) => {
    const {addWishlist, updateWishlist} = useWishlistStore();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        image: ''
    })

    const [errors, setErrors] = useState({
        title: '',
        price: '',
        image: ''
    });

    useEffect(() => {
        console.log('Modal visibility changed:', visible);
        console.log('Edit item:', editItem);

        if(visible){
            if(editItem){
                setFormData({
                    title: editItem.title,
                    price: editItem.price,
                    image: editItem.image,
                })
            } else {
                setFormData({
                    title: '',
                    price: '',
                    image: ''
                })
            }
            setErrors({
                title: '',
                price: '',
                image: ''
            })
        }
    }, [visible, editItem])

    const validateForm = () => {
        const newErrors = {
            title: '',
            price: '',
            image: ''
        };

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.price.trim()) {
            newErrors.price = 'Price is required';
        } else if (isNaN(Number(formData.price))) {
            newErrors.price = 'Price must be a number';
        }

        if (!formData.image.trim()) {
            newErrors.image = 'Image URL is required';
        }

        setErrors(newErrors);
        return !newErrors.title && !newErrors.price && !newErrors.image;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

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

    const handleClose = () => {
        onClose();
    }

    return (
        <Modal 
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editItem ? 'Edit Wishlist' : 'Tambah Wishlist Baru'}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                        >
                            <Ionicons name="close" size={24} color="#666"/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Title *</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.title && styles.inputError
                                ]}
                                placeholder="Masukkan nama wishlist"
                                autoCapitalize="words"
                                value={formData.title}
                                onChangeText={(text) => handleInputChange('title', text)}
                            />
                            {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Price *</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.price && styles.inputError
                                ]}
                                placeholder="Masukkan harga"
                                keyboardType='numeric'
                                value={formData.price}
                                onChangeText={(text) => handleInputChange('price', text)}
                            />
                            {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Image URL *</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.image && styles.inputError
                                ]}
                                placeholder="Masukkan url gambar"
                                keyboardType='url'
                                autoCapitalize="none"
                                value={formData.image}
                                onChangeText={(text) => handleInputChange('image', text)}
                            />
                            {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.button, styles.submitButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>
                                    {editItem ? 'Update' : 'Simpan'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponent

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '100%',
        maxHeight: '80%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    inputError: {
        borderColor: '#ff3b30',
        backgroundColor: '#fffafa',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: 4,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 16,
        gap: 12,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});