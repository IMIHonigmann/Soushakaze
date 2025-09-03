import { BagItem } from '@/stores/bagStores';
import { router } from '@inertiajs/react';
import React from 'react';

type Props = { children?: React.ReactNode; bag: BagItem[]; routeName: string };

export const VisualBag = ({ children, bag, routeName }: Props) => {
    return (
        <span
            className="relative scale-100 cursor-pointer transition-[transform_colors] ease-out hover:scale-125 hover:text-lime-500"
            onClick={() => router.get(route(routeName))}
        >
            {children}
            {bag.length > 0 && (
                <span className="absolute -right-2.5 -bottom-2.5 flex h-5 w-5 -skew-x-12 items-center justify-center bg-red-500 text-xl text-white">
                    {bag.length}
                </span>
            )}
        </span>
    );
};
