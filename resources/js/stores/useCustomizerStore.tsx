import { Attachment } from '@/types/types';
import { create } from 'zustand';
import { Area } from '../pages/Customizer';

interface CustomizerState {
    selected: Record<string, Attachment>;
    currentAreaSelection: Area;
    setSelected: (area: string, attachment: Attachment) => void;
    setCurrentAreaSelection: (area: Area) => void;
    initializeSelections: (grouped: Record<string, Attachment[]>) => void;
}

export const factoryIssueAttachment = {
    id: 0,
    name: 'Factory Issue',
    price_modifier: 0,
    area: 'all' as Area,
    power_modifier: 0,
    accuracy_modifier: 0,
    mobility_modifier: 0,
    handling_modifier: 0,
    magsize_modifier: 0,
};

export const useCustomizerStore = create<CustomizerState>((set) => {
    return {
        selected: {},
        currentAreaSelection: 'all',
        setSelected: (area, attachment) =>
            set((state) => ({
                selected: { ...state.selected, [area]: attachment },
            })),
        setCurrentAreaSelection: (area) => set({ currentAreaSelection: area }),
        initializeSelections: (grouped) =>
            set(() => {
                const initial: Record<string, Attachment> = {};
                Object.entries(grouped).forEach(([area, attachments]) => {
                    if (attachments.length > 0) {
                        initial[area] = factoryIssueAttachment;
                    }
                });
                return { selected: initial };
            }),
    };
});
