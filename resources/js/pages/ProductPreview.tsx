import { Weapon } from '@/types/types';
import { FaRegBookmark } from 'react-icons/fa';
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
    return (
        <div className="mx-32">
            <Navbar />
            <div className="grid grid-cols-2 justify-items-center">
                <div className="sticky top-20 flex w-3/4 items-stretch justify-between">
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
                <div className="flex flex-col gap-4 text-4xl">
                    <h1>On</h1>
                    <div className="font-extrabold">CLOUDPULSE - Training shoe - ivory horizon</div>
                    <div>
                        €160.00 <span className="text-gray-300 opacity-75">VAT included</span>
                    </div>
                    <div className="mt-36">Color: {'green'}</div>
                    <div className="mt-36 grid grid-cols-8 grid-rows-2 place-items-center gap-4 [&>*]:h-full [&>*]:w-full [&>*]:border-2 [&>*]:p-4">
                        <div className="col-span-12">Customize</div>
                        <div className="col-span-11 row-start-2">Add to bag</div>
                        <FaRegBookmark className="col-span-1 row-start-2" />
                    </div>
                    <div className="mt-36 [&>*]:border-2 [&>*]:p-4">
                        <div>Sold by H&K, shipped by Soushakaze.</div>
                        <div>Standard delivery</div>
                        <div>Free delivery and returns</div>
                        <div>30 day return policy</div>
                        <div>Sell it back</div>
                    </div>
                    <div>Report a legal concern</div>
                </div>
            </div>
        </div>
    );
}
