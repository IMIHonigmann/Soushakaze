import { Area, areas, Attachment } from '@/types/types';
import { proxy } from 'valtio';

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

export const state = proxy({
    grouped: {} as Record<string, Attachment[]>,
    selected: Object.values(areas).reduce(
        (acc, area) => {
            if (area === 'all' || area === 'other') return acc;
            acc[area] = factoryIssueAttachment;
            return acc;
        },
        {} as Record<string, Attachment>,
    ),
    cameraControlsEnabled: true,
    currentAreaSelection: 'all' as Area,
});
