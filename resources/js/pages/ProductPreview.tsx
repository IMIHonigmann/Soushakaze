import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { useCartStore, useWishlistStore } from '@/stores/bagStores';
import { Weapon } from '@/types/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FaBookmark, FaFontAwesomeFlag, FaRegBookmark } from 'react-icons/fa';
import Navbar from './Navbar';

type Props = {
    weapon: Weapon;
    reviews: any;
    avgRating: number;
};

export default function ProductPreview({ weapon, reviews, avgRating }: Props) {
    console.log(weapon);
    console.log(reviews);
    console.log(avgRating);

    const { addToBag } = useCartStore((state) => state);
    const { addToBag: addToWishlist, bag: wishlistBag, deleteFromBag: deleteFromWishlistBag } = useWishlistStore((state) => state);

    const [bookmarked, setBookmarked] = useState(wishlistBag.some((item) => item.customizedWeaponId === makeSelectionKey(weapon.id, {})));

    return (
        <div className="mx-32">
            <Navbar />
            <div className="grid grid-cols-2 justify-items-center text-xl">
                <div className="sticky top-10 flex w-3/4 items-stretch justify-between self-start">
                    <ul className="flex flex-col gap-2 [&>*]:border-2 [&>*]:p-8">
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                        <li>6</li>
                        <li>7</li>
                    </ul>
                    <div className="flex h-[900px] items-center border-2 border-white px-52">Image</div>
                </div>
                <div>
                    <div className="flex flex-col gap-4 text-4xl">
                        <h1 className="">On</h1>
                        <div className="font-extrabold">CLOUDPULSE - Training shoe - ivory horizon</div>
                        <div className="text-3xl">
                            €{weapon.price} <span className="text-gray-300 opacity-75">VAT included</span>
                        </div>

                        <div className="mt-8 text-xl">
                            <h1>Delivery</h1>
                            <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-2">
                                <span className="font-extrabold">June 15, 2024 - June 18, 2024</span>
                                <span className="place-self-end">Free</span>
                                <span className="col-start-1 row-start-2 font-extrabold">June 13, 2024 - June 14, 2024</span>
                                <span className="place-self-end">4,90EUR</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-36">Color: {'green'}</div>
                    <div className="mt-36 grid grid-cols-8 grid-rows-2 place-items-center gap-4 [&>*]:h-full [&>*]:w-full [&>*]:border-2 [&>*]:p-4">
                        <Link className="col-span-12 transition-colors hover:bg-zinc-900" href={route('customizer', { weaponId: weapon.id })}>
                            Customize
                        </Link>
                        <Link
                            className="col-span-11 row-start-2 hover:bg-zinc-900"
                            onClick={() =>
                                addToBag({
                                    customizedWeaponId: makeSelectionKey(weapon.id, {}),
                                    weaponId: weapon.id,
                                    weaponName: weapon.name,
                                    selectedAttachments: {},
                                    quantity: 1,
                                })
                            }
                            href={route('cart')}
                        >
                            ADD TO CART
                        </Link>
                        <button
                            className="hover:bg-zinc-900"
                            onClick={() => {
                                const customizedWeaponId = makeSelectionKey(weapon.id, {});
                                const existingWeaponIdx = wishlistBag.findIndex((item) => customizedWeaponId === item.customizedWeaponId);
                                setBookmarked((prev) => !prev);
                                if (existingWeaponIdx === -1) {
                                    addToWishlist({
                                        customizedWeaponId: makeSelectionKey(weapon.id, {}),
                                        weaponId: weapon.id,
                                        weaponName: weapon.name,
                                        selectedAttachments: {},
                                        quantity: 1,
                                    });
                                    return;
                                }

                                console.log(customizedWeaponId);
                                deleteFromWishlistBag(existingWeaponIdx);
                                return;
                            }}
                        >
                            {bookmarked ? <FaBookmark className="col-span-1 row-start-2" /> : <FaRegBookmark className="col-span-1 row-start-2" />}
                        </button>
                    </div>
                    <ul className="mt-36 [&>*]:border-2 [&>*]:p-4">
                        <li>Sold by H&K, shipped by Soushakaze.</li>
                        <li>Free delivery and returns</li>
                        <li>30 day return policy</li>
                        <li>Sell it back</li>
                    </ul>
                    <span className="mt-5 flex gap-4 text-blue-600">
                        <FaFontAwesomeFlag />
                        <span>Report a legal concern</span>
                    </span>
                </div>
            </div>
            <p className="mt-96 text-9xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam enim, nec
                dictum urna quam nec urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
                ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam at risus et justo dignissim congue. Donec congue
                lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in
                metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in
                blandit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class
                aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed molestie augue sit amet leo consequat
                posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin vel ante a orci tempus eleifend
                ut et magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
        </div>
    );
}
