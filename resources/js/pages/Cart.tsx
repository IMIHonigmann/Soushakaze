import { useCartStore } from '@/stores/bagStores';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { GiAmmoBox } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import Navbar from './Navbar';

export default function Bag() {
    const { bag, setBag, deleteFromBag } = useCartStore((state) => state);
    const [deletingItems, setDeletingItems] = useState<Record<string, boolean>>({});

    const weaponIdAttachments: { weapon_id: number; attachment_ids: number[]; quantity: number }[] = [];
    for (let i = 0; i < bag.length; i++) {
        const attachmentIds = bag[i]?.selectedAttachments ? Object.values(bag[i].selectedAttachments) : [];
        weaponIdAttachments.push({ weapon_id: bag[i].weaponId, attachment_ids: attachmentIds, quantity: bag[i].quantity });
    }

    function placeOrder() {
        router.post(route('place-order'), { weaponid_attachments: weaponIdAttachments });
    }

    return (
        <>
            <div className="mx-32">
                <Navbar />
                <div className="mx-32">
                    <div className="my-8 text-5xl font-extrabold">Your bag ({bag.length} Items)</div>
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
                            {bag.length > 0 ? (
                                <>
                                    {bag.map((item, idx) => (
                                        <div key={item.uuid} className={`flex gap-8 p-12 ${deletingItems[item.uuid] ? 'animate-scale-inward' : ''}`}>
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
                                            <div className="ml-auto flex items-center gap-4 text-xl">
                                                <div className="relative flex self-start border-2 shadow-sm">
                                                    <select
                                                        value={item.quantity || 1}
                                                        onChange={(e) => {
                                                            const updatedBag = [...bag];
                                                            updatedBag[idx].quantity = parseInt(e.target.value);
                                                            setBag(updatedBag);
                                                        }}
                                                        className="cursor-pointer appearance-none bg-transparent py-4 pr-20 pl-5 outline-none hover:bg-gray-900"
                                                    >
                                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                                            <option onClick={() => (bag[idx].quantity = num)} value={num}>
                                                                {num}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-2xl">
                                                        <FaChevronDown className="" />
                                                    </div>
                                                </div>
                                                <span
                                                    onClick={() => {
                                                        setDeletingItems((prev) => ({ ...prev, [item.uuid]: true }));
                                                        setTimeout(() => deleteFromBag(idx), 500);
                                                    }}
                                                    className="cursor-pointer self-start p-2 text-3xl hover:bg-zinc-900"
                                                >
                                                    <RxCross1 />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => setBag([])}> Delete all elements from bag</button>
                                </>
                            ) : (
                                <div className="flex h-full min-h-screen items-center justify-center">Bag is empty</div>
                            )}
                        </div>
                        <div className="sticky top-10 self-start bg-zinc-900 p-6 text-center">
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
                    if (bag.length === 0) return;
                    placeOrder();
                }}
                disabled={bag.length === 0}
                className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            >
                Checkout
            </button>
        </>
    );
}
