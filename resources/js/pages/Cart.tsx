import { router } from '@inertiajs/react';
import { useState } from 'react';

type CartItem = { weaponId: number; weaponName: string; selectedAttachments: Record<string, number> };

export default function Cart() {
    const cartItem = localStorage.getItem('cart');
    const [cartArray, setCartArray] = useState<CartItem[]>(cartItem ? JSON.parse(cartItem) : []);
    const attachmentIds = cartArray[0]?.selectedAttachments ? Object.values(cartArray[0].selectedAttachments) : [];

    function placeOrder() {
        router.post(route('place-order'), { weapon_id: cartArray[0].weaponId, attachment_ids: attachmentIds });
    }

    return (
        <>
            {cartArray.length > 0 ? (
                <>
                    {cartArray.map((item, idx) => (
                        <div key={idx}>
                            {item.weaponName} <br />
                            {Object.entries(item.selectedAttachments).map(([area, id]) => (
                                <div key={area}>
                                    {area}: {id}
                                </div>
                            ))}
                            <br />
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            localStorage.removeItem('cart');
                            setCartArray([]);
                        }}
                    >
                        {' '}
                        Delete all elements from cart
                    </button>
                </>
            ) : (
                <div className="flex h-full min-h-screen items-center justify-center">Cart is empty</div>
            )}
            <br />
            <button
                onClick={async () => {
                    if (cartArray.length === 0) return;
                    placeOrder();
                }}
                disabled={cartArray.length === 0}
                className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            >
                Checkout
            </button>
        </>
    );
}
