type Props = {
    user: {
        id: number;
        name: string;
        email: string;
    };
    orders: any;
};

export default function OrderHistory({ user, orders }: Props) {
    console.log(user);
    console.log(orders);
    return <div>OrderHistory</div>;
}
