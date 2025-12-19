import { Weapon } from '@/types/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { IoMdStar, IoMdStarOutline } from 'react-icons/io';

type Props = {
    weapon: Weapon & { seller_name: string };
};

export default function ComposeReview({ weapon }: Props) {
    const [hoveredStar, setHoveredStar] = useState(1);
    const [clickedStar, setClickedStar] = useState(1);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        router.post(route('send-review'), {
            title: form.get('title'),
            review: form.get('review'),
            weapon_id: weapon.id,
            rating: clickedStar,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-3xl">
            <div className="flex gap-8 border p-4 text-3xl">
                <img src={weapon.image_base64} className="min-h-32 min-w-32 border" alt={`${weapon.name}-Image`} />
                <div>
                    <h2 className="font-hitmarker-condensed">{weapon.name}</h2>
                    <h2 className="text-2xl text-zinc-400">Sold by {weapon.seller_name}</h2>
                </div>
            </div>
            <label htmlFor="starRating" className="pl-4 font-hitmarker-condensed text-orange-500">
                Give a Star Rating and share your opinion on this item:
            </label>
            <span id="starRating" className="flex text-9xl" onMouseLeave={() => setHoveredStar(clickedStar)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="cursor-pointer transition-transform duration-150 active:scale-125 active:rotate-2">
                        {hoveredStar >= star ? (
                            <IoMdStar
                                className={`transition-all duration-300 ${clickedStar >= star ? 'text-orange-500' : ''} active:text-yellow-400 active:drop-shadow-[0_0_4px_orange]`}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseDown={() => setClickedStar(star)}
                            />
                        ) : (
                            <IoMdStarOutline onMouseEnter={() => setHoveredStar(star)} />
                        )}
                    </span>
                ))}
            </span>
            <h1 className="font-hitmarker-condensed text-orange-500"></h1>
            <input id="title" name="title" type="text" placeholder="① Give your review a title." className="border-2 p-4 font-hitmarker-condensed" />
            <textarea
                id="review"
                name="review"
                rows={5}
                placeholder="② What did you like or dislike? What did you use this product for?"
                className="border-2 p-4"
            ></textarea>
            <button type="submit" className="mr-auto border-2 px-12 py-4 font-hitmarker-condensed transition-colors hover:bg-zinc-800">
                Submit
            </button>
        </form>
    );
}
