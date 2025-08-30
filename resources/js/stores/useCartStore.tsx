import { create } from 'zustand';

export type CartItem = { weaponId: number; weaponName: string; selectedAttachments: Record<string, number>; quantity: number };

interface CartState {
    cart: CartItem[];
    addToCart: (newItem: CartItem) => void;
    setCart: (newCart: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: (() => {
        const stored = localStorage.getItem('cart');
        const parsedCart: CartItem[] = stored ? JSON.parse(stored) : [];
        return parsedCart;
    })(),
    setCart: (newCart: CartItem[]) =>
        set(() => {
            localStorage.setItem('cart', JSON.stringify(newCart));
            return { cart: newCart };
        }),
    addToCart: (newItem: CartItem) =>
        set((state) => {
            const newCart = [...state.cart, newItem];
            localStorage.setItem('cart', JSON.stringify(newCart));
            return { cart: newCart };
        }),
}));
