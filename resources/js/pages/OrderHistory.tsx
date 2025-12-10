import { Weapon } from '@/types/types';

type Order = {
    id: string;
    user_id: number;
    status: string;
    expected_arrival_date: string | null;
    created_at: string;
    updated_at: string;
};

type OrderedWeapons = Order & {
    weapons: Pick<Weapon, 'id' | 'name' | 'price' | 'seller_id' | 'manufacturer_id'>[];
};

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
    };
    orders: OrderedWeapons[];
};

export default function OrderHistory({ user, orders }: Props) {
    console.log(orders);
    return (
        <ul>
            {orders.map((order, index) =>
                order.weapons.map((weapon, windex) => (
                    <li className="p-3" key={`${index}-${windex}`}>
                        <h1>{order.id}</h1>
                        <div>{weapon.name}</div>
                    </li>
                )),
            )}
        </ul>
    );
}
