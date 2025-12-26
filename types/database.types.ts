export interface Database {
    public: {
        Tables: {
            wishlists: {
                Row: {
                    id: string;
                    title: string;
                    price: string;
                    image: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    price: string;
                    image: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    price?: string;
                    image?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}
