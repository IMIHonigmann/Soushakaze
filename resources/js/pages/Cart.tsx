import { useCartStore } from '@/stores/useCartStore';
import { router } from '@inertiajs/react';
import { FaChevronDown } from 'react-icons/fa';
import { GiAmmoBox } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
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
                    <div className="my-8 text-5xl font-extrabold">Your cart ({cart.length} Items)</div>
                    <div className="flex gap-4">
                        <GiAmmoBox className="text-4xl" />
                        <div className="flex flex-col justify-start py-1 text-xl">
                            <div className="items-center">
                                <p> Bag shipped by Soushakaze</p>
                                <p className="font-extrabold">Tue, 02/09 - Wed, 03/09</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid min-h-[100svh] w-full grid-cols-[3fr_1fr] gap-20">
                        <div className="flex flex-col divide-y-2">
                            {cart.length > 0 ? (
                                <>
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex gap-8 p-12">
                                            <div className="border-2 p-20">🖼️</div>
                                            <div className="flex items-center">
                                                <div>
                                                    {item.weaponName}
                                                    {Object.entries(item.selectedAttachments).map(([area, id]) => (
                                                        <div key={area}>
                                                            {area}: {id}
                                                        </div>
                                                    ))}
                                                    <button className="mt-6 hover:underline">Move to wishlist</button>
                                                </div>
                                            </div>
                                            <div className="ml-auto flex gap-4 text-2xl">
                                                <span className="inline-flex items-center gap-16 self-start border-2 px-5 py-3">
                                                    <span>1</span>
                                                    <FaChevronDown className="text-xl" />
                                                </span>
                                                <span className="self-start p-2 hover:bg-zinc-900">
                                                    <RxCross1 className="text-3xl" />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => setCart([])}> Delete all elements from cart</button>
                                </>
                            ) : (
                                <div className="flex h-full min-h-screen items-center justify-center">Cart is empty</div>
                            )}
                        </div>
                        <div className="self-start bg-zinc-900 p-6 text-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                            aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Pellentesque habitant morbi
                            tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
                            tempor sit amet, ante
                        </div>
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
