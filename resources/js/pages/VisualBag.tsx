import { BagItem } from '@/stores/bagStores';
import { router } from '@inertiajs/react';
import React from 'react';

type Props = { children?: React.ReactNode; bag: BagItem[]; routeName: string; className?: string; spanClassName?: string };

export const VisualBag = ({ children, bag, routeName, className, spanClassName = 'bg-red-500' }: Props) => {
    function totalQuantity() {
        return bag.reduce((total, item) => total + item.quantity, 0);
    }
    return (
        <span className={className} onClick={() => router.get(route(routeName))}>
            {children}
            {bag.length > 0 && (
                <span
                    className={`absolute -bottom-3 flex h-5 ${totalQuantity() >= 12 ? '-right-3.5 w-6' : '-right-3 w-5'} -skew-x-12 items-center justify-center text-xl text-white ${spanClassName}`}
                >
                    {totalQuantity()}
                </span>
            )}
        </span>
    );
};
