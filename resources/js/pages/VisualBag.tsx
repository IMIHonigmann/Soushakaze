import { BagItem } from '@/stores/bagStores';
import { router } from '@inertiajs/react';
import React from 'react';

type Props = { children?: React.ReactNode; bag: BagItem[]; routeName: string; className?: string };

export const VisualBag = ({ children, bag, routeName, className = 'bg-red-500' }: Props) => {
    return (
        <span
            className="relative scale-100 cursor-pointer transition-[transform_colors] ease-out hover:scale-125 hover:text-lime-500"
            onClick={() => router.get(route(routeName))}
        >
            {children}
            {bag.length > 0 && (
                <span className={`absolute -right-3 -bottom-3 flex h-5 w-6 -skew-x-12 items-center justify-center text-xl text-white ${className}`}>
                    {bag.length}
                </span>
            )}
        </span>
    );
};
