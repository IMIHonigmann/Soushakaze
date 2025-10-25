import { Area } from '@/pages/Customizer';

export type Weapon = {
    id: number;
    avg_rating: string;
    name: string;
    rate_of_fire: number;
    type: string;
    power: number;
    accuracy: number;
    mobility: number;
    handling: number;
    extra_mags: number;
    magsize: number;
    price: number;
    image_base64: string;
};

export type Attachment = {
    id: number;
    seller_id?: number | null;
    manufacturer_id?: number | null;
    name: string;
    price: number;
    area: Area;
    image_blob?: string | null; // base64 or URL depending on API
    power_modifier: number;
    accuracy_modifier: number;
    mobility_modifier: number;
    handling_modifier: number;
    magsize_modifier: number;
    created_at?: string;
    updated_at?: string;
};
