import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    title: string;
    price: string;
    image: string;
}

interface WishlistState {
    wishlists: WishlistItem[];
    loading: boolean;
    
    // Actions
    addWishlist: (item: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
    updateWishlist: (id: string, item: Partial<WishlistItem>) => void;
    deleteWishlist: (id: string) => void;
    getWishlist: (id: string) => WishlistItem | undefined;
    clearAll: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlists: [],
            loading: false,

            addWishlist: (item) => {
                const newItem: WishlistItem = {
                ...item,
                id: Date.now().toString(),
                };

                set((state) => ({
                wishlists: [newItem, ...state.wishlists],
                }));
            },

            updateWishlist: (id, updatedItem) => {
                set((state) => ({
                wishlists: state.wishlists.map((item) =>
                    item.id === id ? { ...item, ...updatedItem } : item
                ),
                }));
            },

            deleteWishlist: (id) => {
                set((state) => ({
                wishlists: state.wishlists.filter((item) => item.id !== id),
                }));
            },

            getWishlist: (id) => {
                const { wishlists } = get();
                return wishlists.find((item) => item.id === id);
            },

            clearAll: () => {
                set({ wishlists: [] });
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => AsyncStorage),
            version: 1
        }
    )
);