import { Attachment, Weapon } from '@/types/types';
import { useEffect, useState } from 'react';
import { FaTruck } from 'react-icons/fa6';
import ProfileLayout from './layouts/ProfileLayout';

type Order = {
    id: string;
    user_id: number;
    status: string;
    expected_arrival_date: string | null;
    created_at: string;
    updated_at: string;
};

type WeaponsPerOrder = Order & {
    weapons: (Pick<Weapon, 'id' | 'name' | 'price' | 'seller_id' | 'manufacturer_id'> & {
        attachments: Pick<Attachment, 'id' | 'name' | 'area' | 'price_modifier'>[];
        modified_price: number;
    })[];
};

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
    };
    orders: WeaponsPerOrder[];
};

export default function OrderHistory({ user, orders }: Props) {
    console.log(orders);
    const [orderProgress, setOrderProgress] = useState<Record<string, number>>({});

    function getOrderProgress(order: Order) {
        const createdDate = new Date(order.created_at);
        const expectedDate = new Date(order.expected_arrival_date || Date.now());
        const now = new Date();

        const totalDuration = expectedDate.getTime() - createdDate.getTime();
        const elapsed = now.getTime() - createdDate.getTime();
        const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

        return progress;
    }

    useEffect(() => {
        orders.forEach((order, index) => {
            setTimeout(() => {
                setOrderProgress((prev) => ({ ...prev, [order.id]: getOrderProgress(order) }));
            }, 100 * index);
        });
    }, [orders]);

    return (
        <ProfileLayout>
            <ul>
                {orders.map((order, index) => (
                    <li className="m-4 border p-4">
                        <div>Order Date: {order.created_at}</div>
                        <div>Expected Arrival Date: {order.expected_arrival_date}</div>
                        <div className="relative h-4 -skew-x-12 border-2 bg-white p-2">
                            <span
                                className="absolute top-0 left-0 h-full w-0 border-r-2 bg-orange-500 transition-all duration-300"
                                style={{ width: `${orderProgress[order.id] || 0}%` }}
                            >
                                <FaTruck
                                    className="absolute top-0 right-2 translate-x-7 animate-pulse text-black transition-all"
                                    style={{ transform: `translateX(${orderProgress[order.id] || 0}%)` }}
                                />
                            </span>
                        </div>
                        {order.weapons.map((weapon, windex) => (
                            <div className="p-3" key={`${index}-${windex}`}>
                                <div>{weapon.name}</div>
                                <div>{weapon.modified_price}€</div>
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </ProfileLayout>
    );
}
