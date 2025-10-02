import { create } from 'zustand';

export type BagItem = {
    customizedWeaponId: string;
    weaponId: number;
    weaponName: string;
    selectedAttachments: Record<string, number>;
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
                const newBag = [...state.bag, newItem];
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
