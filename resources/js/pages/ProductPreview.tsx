import { displayStars } from '@/helpers/displayStars';
import { getRelativeTime } from '@/helpers/getRelativeTime';
import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { useCartStore, useWishlistStore } from '@/stores/bagStores';
import { Weapon } from '@/types/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { FaBookmark, FaFontAwesomeFlag, FaRegBookmark } from 'react-icons/fa';
import { IoLanguageSharp } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';
import Navbar from './Navbar';

type Review = {
    id: number;
    user_id: number;
    weapon_id: number;
    rating: number;
    review: string;
    title: string;
    created_at: string;
    updated_at: string;
};

type Props = {
    weapon: Weapon;
    reviews: Review[];
    avgRating: number;
};

export default function ProductPreview({ weapon, reviews, avgRating }: Props) {
    console.log(weapon);
    console.log(reviews);
    console.log('avg', avgRating);

    const { addToBag } = useCartStore((state) => state);
    const { addToBag: addToWishlist, bag: wishlistBag, deleteFromBag: deleteFromWishlistBag } = useWishlistStore((state) => state);
    const [reviewsVisible, setReviewsVisible] = useState(false);

    const [bookmarked, setBookmarked] = useState(wishlistBag.some((item) => item.customizedWeaponId === makeSelectionKey(weapon.id, {})));

    return (
        <div className="mx-32">
            <Navbar />
            <div className="grid grid-cols-2 justify-items-center text-xl">
                <div className="sticky top-10 flex w-3/4 items-stretch justify-between gap-4 self-start">
                    <ul className="flex flex-col gap-4 [&>*]:border-2 [&>*]:p-8">
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                        <li>6</li>
                        <li>7</li>
                    </ul>
                    <div className="flex h-[900px] min-w-xl items-center border-2 border-white">
                        <img alt={weapon.name} src={`data:image/png;base64,${weapon.image_base64}`} />
                    </div>
                </div>
                <div>
                    <div className="flex flex-col gap-4 text-4xl">
                        <h1 className="">On--</h1>
                        <div className="font-hitmarker-condensed text-7xl font-extrabold">{weapon.name}</div>
                        <div className="text-3xl">
                            €{weapon.price} <span className="text-gray-300 opacity-75">VAT included</span>
                        </div>

                        <div className="mt-8 text-xl">
                            <h1>Delivery</h1>
                            <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-2">
                                <span className="font-extrabold">June 15, 2024 - June 18, 2024</span>
                                <span className="place-self-end">Free</span>
                                <span className="col-start-1 row-start-2 font-extrabold">June 13, 2024 - June 14, 2024</span>
                                <span className="place-self-end">4,90EUR--</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-36">Color: {'green--'}</div>
                    <div className="mt-36 grid grid-cols-8 grid-rows-2 place-items-center gap-4 [&>*]:h-full [&>*]:w-full [&>*]:border-2 [&>*]:p-4">
                        <Link className="col-span-12 transition-colors hover:bg-zinc-900" href={route('customizer', { weaponId: weapon.id })}>
                            Customize
                        </Link>
                        <Link
                            className="col-span-11 row-start-2 hover:bg-zinc-900"
                            onClick={() =>
                                addToBag({
                                    customizedWeaponId: makeSelectionKey(weapon.id, {}),
                                    weapon,
                                    customizedPrice: weapon.price,
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
                                        weapon,
                                        customizedPrice: weapon.price,
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
                        <li>Sold by H&K, shipped by Soushakaze.--</li>
                        <li>Free delivery and returns</li>
                        <li>30 day return policy</li>
                        <li>Sell it back</li>
                    </ul>
                    <span className="mt-5 flex gap-4 text-blue-600">
                        <FaFontAwesomeFlag />
                        <span>Report a legal concern</span>
                    </span>
                    {avgRating && (
                        <div className="mt-6 font-hitmarker-condensed text-5xl">
                            Ratings
                            <div className="mt-2 flex gap-2 text-4xl">
                                <span>{avgRating?.toFixed(2)}</span>
                                <span>{displayStars(avgRating?.toString())}</span>
                            </div>
                        </div>
                    )}
                    {(() => {
                        const highestReview = reviews.reduce((max, review) => {
                            if (review.rating > max.rating) return review;
                            if (review.rating === max.rating && review.created_at > max.created_at) return review;
                            return max;
                        }, reviews[0]);

                        return (
                            highestReview && (
                                <div className="mt-6 flex flex-col gap-y-1 border p-3">
                                    <div className="flex justify-between">
                                        <span className="text-3xl">{displayStars(highestReview.rating.toString())}</span>
                                        <p>{getRelativeTime(highestReview.created_at)}</p>
                                    </div>
                                    <h1 className="font-hitmarker-condensed text-3xl">{highestReview.title}</h1>
                                    <p>{highestReview.review}</p>
                                    <div className="flex items-center gap-1">
                                        <IoLanguageSharp className="text-2xl" />{' '}
                                        <span className="text-sm opacity-75">Original language: {'German'}</span>
                                    </div>
                                </div>
                            )
                        );
                    })()}
                    {avgRating && (
                        <button
                            className="mt-4 block w-full border-4 p-3 text-center transition-all hover:bg-zinc-800"
                            onClick={() => setReviewsVisible(true)}
                        >
                            All reviews
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-12">Other Weapons: //to be implemented</div>
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
            <div
                className={`fixed top-0 left-0 ${reviewsVisible ? '' : 'pointer-events-none opacity-0'} flex h-screen w-screen flex-col items-center justify-center bg-black/75 transition-all`}
                onClick={() => setReviewsVisible(false)}
            >
                <div
                    className={`${reviewsVisible ? '' : 'translate-y-6 scale-95'} flex h-3/4 w-1/3 flex-col gap-y-4 overflow-y-scroll border border-zinc-800 bg-zinc-900 p-4 transition-transform`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between">
                        <h1 className="font-hitmarker-condensed text-5xl">All ratings</h1>
                        <RxCross1
                            className={` ${reviewsVisible ? '' : 'rotate-180'} ml-auto cursor-pointer text-4xl transition-all hover:bg-zinc-950`}
                            onClick={() => setReviewsVisible(false)}
                        />
                    </div>

                    <div className="flex items-center justify-between font-hitmarker-condensed">
                        <span className="flex items-center gap-2 text-4xl">
                            <span>{avgRating?.toFixed(2)}</span>
                            <span>{displayStars(avgRating?.toString())}</span>
                        </span>
                        <span className="text-2xl">{reviews.length} Ratings</span>
                    </div>

                    <div>LineRatings*</div>
                    <p>
                        Customer reviews based on a verified purchase will have a ‘Verified Purchase’ tag.{' '}
                        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                            <span className="underline transition-opacity hover:opacity-75">Learn how ratings and reviews work.</span>
                        </a>
                    </p>
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index} className="mt-6 flex flex-col gap-y-1 border p-3">
                                <div className="flex justify-between">
                                    <span className="text-3xl">{displayStars(review.rating.toString())}</span>
                                    <p>{getRelativeTime(review.created_at)}</p>
                                </div>
                                <h1 className="font-hitmarker-condensed text-3xl">{review.title}</h1>
                                <p>{review.review}</p>
                                <div className="flex items-center gap-1">
                                    <IoLanguageSharp className="text-2xl" /> <span className="text-sm opacity-75">Original language: {'German'}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
