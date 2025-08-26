import { create } from 'zustand';

export type CartItem = { weaponId: number; weaponName: string; selectedAttachments: Record<string, number> };

interface CartState {
    cart: CartItem[];
    addToCart: (newItem: CartItem) => void;
    setCart: (newCart: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    setCart: (newCart: CartItem[]) => set({ cart: newCart }),
    addToCart: (newItem: CartItem) =>
        set((state) => {
            const newCart = [...state.cart, newItem];

            return { cart: newCart };
        }),
}));
