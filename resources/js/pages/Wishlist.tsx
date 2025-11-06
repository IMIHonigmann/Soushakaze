import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { useCartStore, useWishlistStore } from '@/stores/bagStores';
import { Attachment } from '@/types/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FaGifts } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import Navbar from './Navbar';

export default function Bag() {
    const { bag, deleteFromBag } = useWishlistStore((state) => state);
    const [deletingItems, setDeletingItems] = useState<Record<string, boolean>>({});

    const { addToBag: addToCartBag } = useCartStore((state) => state);

    const weaponIdAttachments: { weapon_id: number; attachments: Attachment[]; quantity: number }[] = [];
    for (let i = 0; i < bag.length; i++) {
        const attachments = bag[i]?.selectedAttachments ? Object.values(bag[i].selectedAttachments) : [];
        weaponIdAttachments.push({ weapon_id: bag[i].weaponId, attachments: attachments, quantity: bag[i].quantity });
    }

    return (
        <>
            <div className="mx-32">
                <Navbar />
                <div className="mx-32">
                    <div className="my-8 flex gap-4 text-5xl">
                        <FaGifts />
                        <span className="font-extrabold">Your wishlist ({bag.length} Items)</span>
                    </div>
                    <div className="flex flex-col justify-start py-1 text-xl"></div>
                    <div className="grid min-h-[100svh] w-full grid-cols-[3fr_1fr] gap-20">
                        <div className="flex flex-col divide-y-2">
                            {bag.length > 0 ? (
                                <>
                                    {bag.map((item, idx) => (
                                        <div
                                            key={item.customizedWeaponId}
                                            className={`flex gap-8 p-12 ${deletingItems[item.customizedWeaponId] ? 'animate-scale-inward' : ''}`}
                                        >
                                            <div className="border-2 p-20">🖼️</div>
                                            <div className="flex items-center">
                                                <div>
                                                    {item.weaponName}
                                                    {Object.entries(item.selectedAttachments).map(([area, att]) => (
                                                        <div key={area}>
                                                            {area}: {att.name}
                                                        </div>
                                                    ))}
                                                    <Link
                                                        className="mt-6 cursor-pointer hover:underline"
                                                        onClick={() =>
                                                            addToCartBag({
                                                                customizedWeaponId: makeSelectionKey(item.weaponId, item.selectedAttachments),
                                                                weaponId: item.weaponId,
                                                                weaponName: item.weaponName,
                                                                selectedAttachments: item.selectedAttachments,
                                                                quantity: 1,
                                                            })
                                                        }
                                                        href={route('cart')}
                                                    >
                                                        Add to cart
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="ml-auto flex items-center gap-4 text-xl">
                                                <span
                                                    onClick={() => {
                                                        setDeletingItems((prev) => ({ ...prev, [item.customizedWeaponId]: true }));
                                                        setTimeout(() => deleteFromBag(idx), 500);
                                                    }}
                                                    className="cursor-pointer self-start p-2 text-3xl hover:bg-zinc-900"
                                                >
                                                    <RxCross1 />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex h-full min-h-screen items-center justify-center">Bag is empty</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <br />
        </>
    );
}
