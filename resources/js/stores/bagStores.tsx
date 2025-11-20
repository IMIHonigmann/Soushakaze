import { Attachment, Weapon } from '@/types/types';
import { create } from 'zustand';

export type BagItem = {
    customizedWeaponId: string;
    weapon: Weapon;
    customizedPrice: number;
    selectedAttachments: Record<string, Attachment>;
    quantity: number;
};

interface BagState {
    bag: BagItem[];
    addToBag: (newItem: BagItem) => void;
    setBag: (newBag: BagItem[]) => void;
    deleteFromBag: (index: number) => void;
}

export const createBagStore = (bagName: string) =>
    create<BagState>((set) => ({
        bag: (() => {
            const stored = localStorage.getItem(bagName);
            const parsedBag: BagItem[] = stored ? JSON.parse(stored) : [];
            console.log(parsedBag);
            return parsedBag;
        })(),
        setBag: (newBag: BagItem[]) =>
            set(() => {
                localStorage.setItem(bagName, JSON.stringify(newBag));
                return { bag: newBag };
            }),
        addToBag: (newItem: BagItem) =>
            set((state) => {
                const idx = state.bag.findIndex((i) => i.customizedWeaponId === newItem.customizedWeaponId);
                let newBag: BagItem[];
                if (idx === -1) {
                    newBag = [...state.bag, newItem];
                } else {
                    const existing = state.bag[idx];
                    const merged: BagItem = {
                        ...existing,
                        quantity: (existing.quantity ?? 0) + (newItem.quantity ?? 1),
                        selectedAttachments: { ...newItem.selectedAttachments },
                        weapon: newItem.weapon,
                        customizedPrice: newItem.customizedPrice,
                    };
                    newBag = [...state.bag];
                    newBag[idx] = merged;
                }

                localStorage.setItem(bagName, JSON.stringify(newBag));
                return { bag: newBag };
            }),
        deleteFromBag: (index: number) =>
            set((state) => {
                const newBag = [...state.bag];
                newBag.splice(index, 1);
                localStorage.setItem(bagName, JSON.stringify(newBag));
                return { bag: newBag };
            }),
    }));

export const useCartStore = createBagStore('cart');
export const useWishlistStore = createBagStore('wishlist');
