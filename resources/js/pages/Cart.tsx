import { useCartStore } from '@/stores/useCartStore';
import { router } from '@inertiajs/react';
import Navbar from './Navbar';

export default function Cart() {
    const { cart, setCart } = useCartStore((state) => state);

    const weaponIdAttachments: { weapon_id: number; attachment_ids: number[] }[] = [];
    for (let i = 0; i < cart.length; i++) {
        const attachmentIds = cart[i]?.selectedAttachments ? Object.values(cart[i].selectedAttachments) : [];
        weaponIdAttachments.push({ weapon_id: cart[i].weaponId, attachment_ids: attachmentIds });
    }

    function placeOrder() {
        router.post(route('place-order'), { weaponid_attachments: weaponIdAttachments });
    }

    return (
        <>
            <div className="mx-32">
                <Navbar />
                <div className="mx-32">
                    <div className="mb-5 text-5xl">Your cart ({cart.length} Items)</div>
                    <div className="grid min-h-[100svh] w-full grid-cols-2 justify-center gap-8">
                        <div className="flex flex-col">
                            {cart.length > 0 ? (
                                <>
                                    {cart.map((item, idx) => (
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
                                    <button onClick={() => setCart([])}> Delete all elements from cart</button>
                                </>
                            ) : (
                                <div className="flex h-full min-h-screen items-center justify-center">Cart is empty</div>
                            )}
                        </div>
                        <div>Checkoutstuff</div>
                    </div>
                </div>
            </div>
            <br />
            <button
                onClick={async () => {
                    if (cart.length === 0) return;
                    placeOrder();
                }}
                disabled={cart.length === 0}
                className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            >
                Checkout
            </button>
        </>
    );
}
