import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { useCartStore, useWishlistStore } from '@/stores/bagStores';
import { Attachment } from '@/types/types';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    FaBitcoin,
    FaCcAmex,
    FaCcApplePay,
    FaCcDinersClub,
    FaCcDiscover,
    FaCcMastercard,
    FaCcPaypal,
    FaCcVisa,
    FaChevronDown,
} from 'react-icons/fa6';
import { GiAmmoBox } from 'react-icons/gi';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { RxCross1 } from 'react-icons/rx';
import { SiKlarna, SiSepa } from 'react-icons/si';
import Navbar from './Navbar';

type Props = {
    freeShippingThreshold: number;
    standardShippingCost: number;
    premiumShippingExtraCost: number;
};

export default function Bag({ freeShippingThreshold, standardShippingCost, premiumShippingExtraCost }: Props) {
    const { bag, setBag, deleteFromBag } = useCartStore((state) => state);
    const [deletingItems, setDeletingItems] = useState<Record<string, boolean>>({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [premiumShipping, setPremiumShipping] = useState(false);
    const thresholdDifference = Math.pow(10, Math.floor(Math.log10(freeShippingThreshold)));

    useEffect(() => {
        setTotalPrice(bag.reduce((total, item) => total + item.customizedPrice * item.quantity, 0));
    }, [bag]);

    useEffect(() => {
        setShippingCost((totalPrice > freeShippingThreshold ? 0 : standardShippingCost) + (premiumShipping ? premiumShippingExtraCost : 0));
    }, [freeShippingThreshold, premiumShipping, premiumShippingExtraCost, standardShippingCost, totalPrice]);

    const { addToBag: addToWishlistBag, bag: wishlistBag } = useWishlistStore((state) => state);

    const weaponIdAttachments: { weapon_id: number; attachments: Attachment[]; quantity: number }[] = [];
    for (let i = 0; i < bag.length; i++) {
        const attachments = bag[i]?.selectedAttachments ? Object.values(bag[i].selectedAttachments) : [];
        weaponIdAttachments.push({ weapon_id: bag[i].weapon.id, attachments: attachments, quantity: bag[i].quantity });
    }

    function placeOrder() {
        router.post(route('place-order'), { weaponid_attachments: weaponIdAttachments });
    }

    return (
        <>
            <div className="mx-48">
                <Navbar />
                <div className="mx-32">
                    <div className="grid min-h-[100svh] w-full grid-cols-[2.5fr_1fr] gap-20">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-y-6">
                                <div className="text-5xl font-extrabold">
                                    Your bag ({bag.reduce((total, item) => total + item.quantity, 0)} Items)
                                </div>
                                <div
                                    className={`grid grid-cols-[auto_1fr] grid-rows-2 items-center bg-zinc-900 transition-all duration-500 ease-in-out ${
                                        totalPrice > freeShippingThreshold || totalPrice < freeShippingThreshold - thresholdDifference
                                            ? 'max-h-0 translate-x-[-50vw] overflow-hidden p-0 opacity-0'
                                            : 'max-h-40 translate-x-[0vw] p-4 opacity-100'
                                    }`}
                                >
                                    <IoMdInformationCircleOutline className="mr-1 inline-block text-3xl" />
                                    <span className="font-extrabold">Almost there!</span>
                                    <span className="col-start-2 row-start-2">
                                        If your bag is over {freeShippingThreshold.toFixed(2)}€ you will qualify for free shipping
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <GiAmmoBox className="text-4xl" />
                                    <div className="flex flex-col justify-start py-1 text-xl">
                                        <div className="items-center">
                                            <p> Bag shipped by Soushakaze</p>
                                            <p className="font-extrabold">Tue, 02/09 - Wed, 03/09</p>
                                            <div className="mt-4"></div>
                                            <div className="gap-2 [&>*>*]:mr-5">
                                                <div>
                                                    <input
                                                        onChange={() => setPremiumShipping(false)}
                                                        type="radio"
                                                        name="shipping"
                                                        value="standard"
                                                        defaultChecked
                                                    />
                                                    Standard Shipping
                                                </div>
                                                <div>
                                                    <input onChange={() => setPremiumShipping(true)} type="radio" name="shipping" value="premium" />
                                                    Premium Shipping
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="divide-y-2">
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
                                                        <h3 className="font-hitmarker-condensed text-6xl">{item.weapon.name}</h3>
                                                        <h2
                                                            className={`${item.customizedPrice !== Number(item.weapon.price) ? 'text-lime-400' : ''} -skew-x-12 font-hitmarker-condensed text-3xl`}
                                                        >
                                                            €{item.customizedPrice.toFixed(2)}
                                                        </h2>
                                                        {Object.entries(item.selectedAttachments).map(([area, att]) => (
                                                            <div key={area}>
                                                                <span className="uppercase">{area}</span>: {att.name}
                                                            </div>
                                                        ))}
                                                        <button
                                                            className="mt-6 cursor-pointer hover:underline"
                                                            onClick={() => {
                                                                const customizedWeaponId = makeSelectionKey(item.weapon.id, {});
                                                                const existingWeaponIdx = wishlistBag.findIndex(
                                                                    (item) => customizedWeaponId === item.customizedWeaponId,
                                                                );
                                                                if (existingWeaponIdx === -1) {
                                                                    addToWishlistBag({
                                                                        customizedWeaponId: customizedWeaponId,
                                                                        weapon: item.weapon,
                                                                        customizedPrice: item.customizedPrice,
                                                                        selectedAttachments: item.selectedAttachments,
                                                                        quantity: 1,
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Move to wishlist
                                                        </button>
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
                                        <button onClick={() => setBag([])}> Delete all elements from bag</button>
                                    </>
                                ) : (
                                    <div className="flex h-full min-h-screen items-center justify-center">Bag is empty</div>
                                )}
                            </span>
                        </div>
                        <div className="sticky top-10 divide-y-2 self-start bg-zinc-900 p-6 text-center">
                            <div className="grid grid-cols-2 grid-rows-2 justify-between justify-items-start gap-3 pb-6 [&>*:nth-child(2n)]:justify-self-end">
                                <span>Subtotal</span>
                                <span>{totalPrice.toFixed(2)}€</span>
                                <span>Delivery</span>
                                <span>{shippingCost.toFixed(2)}€</span>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col">
                                    <div className="flex justify-between pt-6">
                                        <span>
                                            <span className="mr-1 text-lg font-extrabold">Total</span>
                                            <span className="text-sm">VAT included</span>
                                        </span>
                                        <span>{(totalPrice + shippingCost).toFixed(2)}€</span>
                                    </div>
                                    <span className="mt-2 inline-flex items-center self-start justify-self-start rounded-full border-2 px-2 py-1">
                                        <span>ફ</span> <span className="ml-2 text-sm">Points</span>
                                    </span>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (bag.length === 0) return;
                                        placeOrder();
                                    }}
                                    disabled={bag.length === 0}
                                    className="block w-full rounded-xs bg-blue-500 px-4 py-2 text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(43,127,254,0.7)] hover:invert disabled:opacity-50"
                                >
                                    Checkout
                                </button>
                                <span className="self-start">We accept</span>
                                <div className="grid grid-cols-5 place-items-center items-center text-5xl">
                                    <FaBitcoin />
                                    <FaCcVisa />
                                    <FaCcMastercard />
                                    <FaCcAmex />
                                    <FaCcPaypal />
                                    <FaCcApplePay />
                                    <SiSepa className="rounded border-2 px-1" />
                                    <FaCcDinersClub />
                                    <SiKlarna className="rounded-md border-2 px-1" />
                                    <FaCcDiscover />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
        </>
    );
}
