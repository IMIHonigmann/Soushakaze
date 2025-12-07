import { Attachment } from '@/types/types';
import { create } from 'zustand';

export const areas = [
    'muzzle',
    'scope',
    'magazine',
    'grip',
    'stock',
    'barrel',
    'laser',
    'flashlight',
    'bipod',
    'underbarrel',
    'other',
    'all',
] as const;

export type Area = (typeof areas)[number];

interface CustomizerState {
    selected: Record<string, Attachment>;
    currentAreaSelection: Area;
    setSelected: (area: string, attachment: Attachment) => void;
    setCurrentAreaSelection: (area: Area) => void;
}

export const factoryIssueAttachment: Attachment = {
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
        selected: Object.values(areas).reduce(
            (acc, area) => {
                acc[area] = factoryIssueAttachment;
                return acc;
            },
            {} as Record<string, Attachment>,
        ),
        currentAreaSelection: 'all',
        setSelected: (area, attachment) =>
            set((state) => ({
                selected: { ...state.selected, [area]: attachment },
            })),
        setCurrentAreaSelection: (area) => set({ currentAreaSelection: area }),
    };
});
