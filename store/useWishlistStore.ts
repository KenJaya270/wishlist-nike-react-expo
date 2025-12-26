import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface WishlistItem {
    id: string;
    title: string;
    price: string;
    image: string;
    created_at?: string;
    updated_at?: string;
}

interface WishlistState {
    wishlists: WishlistItem[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchWishlists: () => Promise<void>;
    fetchWishlistById: (id: string) => Promise<WishlistItem | null>;
    addWishlist: (item: Omit<WishlistItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateWishlist: (id: string, item: Partial<WishlistItem>) => Promise<void>;
    deleteWishlist: (id: string) => Promise<void>;
    getWishlist: (id: string) => WishlistItem | undefined;
    clearAll: () => void;
    clearError: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlists: [],
            loading: false,
            error: null,

            // 🔹 Fetch all wishlists from Supabase
            fetchWishlists: async () => {
                set({ loading: true, error: null });
                try {
                    const { data, error } = await supabase
                        .from('wishlists')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    set({ wishlists: (data as WishlistItem[]) || [], loading: false });
                } catch (error: any) {
                    console.error('Error fetching wishlists:', error);
                    set({
                        error: error.message || 'Failed to fetch wishlists',
                        loading: false
                    });
                }
            },

            // 🔹 Fetch single wishlist by ID from Supabase
            fetchWishlistById: async (id) => {
                set({ loading: true, error: null });
                try {
                    const { data, error } = await supabase
                        .from('wishlists')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) throw error;

                    if (data) {
                        // Update local cache with fetched item
                        set((state) => {
                            const exists = state.wishlists.find(item => item.id === id);
                            if (!exists) {
                                return {
                                    wishlists: [data as WishlistItem, ...state.wishlists],
                                    loading: false,
                                };
                            }
                            return { loading: false };
                        });
                        return data as WishlistItem;
                    }

                    set({ loading: false });
                    return null;
                } catch (error: any) {
                    console.error('Error fetching wishlist by ID:', error);
                    set({
                        error: error.message || 'Failed to fetch wishlist',
                        loading: false
                    });
                    return null;
                }
            },

            // 🔹 Add new wishlist to Supabase
            addWishlist: async (item) => {
                set({ loading: true, error: null });
                try {
                    const { data, error } = await supabase
                        .from('wishlists')
                        .insert({
                            title: item.title,
                            price: item.price,
                            image: item.image,
                        } as any)
                        .select()
                        .single();

                    if (error) throw error;

                    if (data) {
                        set((state) => ({
                            wishlists: [data as WishlistItem, ...state.wishlists],
                            loading: false,
                        }));
                    }
                } catch (error: any) {
                    console.error('Error adding wishlist:', error);
                    set({
                        error: error.message || 'Failed to add wishlist',
                        loading: false
                    });
                    throw error;
                }
            },

            // 🔹 Update wishlist in Supabase
            updateWishlist: async (id, updatedItem) => {
                set({ loading: true, error: null });
                try {
                    // Build the update object with proper typing from Database schema
                    const updateData: Database['public']['Tables']['wishlists']['Update'] = {
                        ...updatedItem,
                        updated_at: new Date().toISOString(),
                    };

                    const { data, error } = await supabase
                        .from('wishlists')
                        // @ts-ignore - Supabase's auto-generated types have a known issue with Update types
                        .update(updateData)
                        .eq('id', id)
                        .select()
                        .single();

                    if (error) throw error;

                    if (data) {
                        set((state) => ({
                            wishlists: state.wishlists.map((item) =>
                                item.id === id ? { ...item, ...(data as WishlistItem) } : item
                            ),
                            loading: false,
                        }));
                    }
                } catch (error: any) {
                    console.error('Error updating wishlist:', error);
                    set({
                        error: error.message || 'Failed to update wishlist',
                        loading: false
                    });
                    throw error;
                }
            },

            // 🔹 Delete wishlist from Supabase
            deleteWishlist: async (id) => {
                set({ loading: true, error: null });
                try {
                    const { error } = await supabase
                        .from('wishlists')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;

                    set((state) => ({
                        wishlists: state.wishlists.filter((item) => item.id !== id),
                        loading: false,
                    }));
                } catch (error: any) {
                    console.error('Error deleting wishlist:', error);
                    set({
                        error: error.message || 'Failed to delete wishlist',
                        loading: false
                    });
                    throw error;
                }
            },

            // 🔹 Get single wishlist by ID (local only)
            getWishlist: (id) => {
                const { wishlists } = get();
                return wishlists.find((item) => item.id === id);
            },

            // 🔹 Clear all wishlists (local only, for testing)
            clearAll: () => {
                set({ wishlists: [] });
            },

            // 🔹 Clear error message
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => AsyncStorage),
            version: 2,
            partialize: (state) => ({ wishlists: state.wishlists }),
        }
    )
);