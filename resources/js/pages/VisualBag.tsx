import { BagItem } from '@/stores/bagStores';
import { router } from '@inertiajs/react';
import React from 'react';

type Props = { children?: React.ReactNode; bag: BagItem[]; routeName: string; className?: string };

export const VisualBag = ({ children, bag, routeName, className = 'bg-red-500' }: Props) => {
    function totalQuantity() {
        return bag.reduce((total, item) => total + item.quantity, 0);
    }
    return (
        <span
            className="relative scale-100 cursor-pointer transition-[transform_colors] ease-out hover:scale-125 hover:text-lime-500"
            onClick={() => router.get(route(routeName))}
        >
            {children}
            {bag.length > 0 && (
                <span
                    className={`absolute -bottom-3 flex h-5 ${totalQuantity() >= 12 ? '-right-3.5 w-6' : '-right-3 w-5'} -skew-x-12 items-center justify-center text-xl text-white ${className}`}
                >
                    {totalQuantity()}
                </span>
            )}
        </span>
    );
};
