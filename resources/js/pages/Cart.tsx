import { router } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from './Navbar';

type CartItem = { weaponId: number; weaponName: string; selectedAttachments: Record<string, number> };

export default function Cart() {
    const cartItem = localStorage.getItem('cart');
    const [cartArray, setCartArray] = useState<CartItem[]>(cartItem ? JSON.parse(cartItem) : []);
    const weaponIdAttachments: { weapon_id: number; attachment_ids: number[] }[] = [];
    for (let i = 0; i < cartArray.length; i++) {
        const attachmentIds = cartArray[i]?.selectedAttachments ? Object.values(cartArray[i].selectedAttachments) : [];
        weaponIdAttachments.push({ weapon_id: cartArray[i].weaponId, attachment_ids: attachmentIds });
    }

    function placeOrder() {
        router.post(route('place-order'), { weaponid_attachments: weaponIdAttachments });
    }

    return (
        <>
            <div className="mx-32">
                <Navbar />
                <div className="grid min-h-[100svh] w-full grid-cols-2 justify-center gap-8">
                    <div className="flex flex-col">
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
                    </div>
                    <div>Checkoutstuff</div>
                </div>
            </div>
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
