import { Attachment } from '@/types/types';
import { create } from 'zustand';
import { Area } from '../pages/Customizer';

interface CustomizerState {
    selected: Record<string, number>;
    currentAreaSelection: Area;
    setSelected: (area: string, id: number) => void;
    setCurrentAreaSelection: (area: Area) => void;
    initializeSelections: (grouped: Record<string, Attachment[]>) => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
    selected: {},
    currentAreaSelection: 'all',
    setSelected: (area, id) =>
        set((state) => ({
            selected: { ...state.selected, [area]: id },
        })),
    setCurrentAreaSelection: (area) => set({ currentAreaSelection: area }),
    initializeSelections: (grouped) =>
        set(() => {
            const initial: Record<string, number> = {};
            Object.entries(grouped).forEach(([area]) => {
                // Default to first attachment's id in each area
                initial[area] = 0;
            });
            return { selected: initial };
        }),
}));
