import { Weapon } from '@/types/types';

type Props = {
    weapon: Weapon;
    reviews: any;
    avgRating: number;
};

export default function ProductPreview({ weapon, reviews, avgRating }: Props) {
    console.log(weapon);
    console.log(reviews);
    console.log(avgRating);
    return <div>{weapon.name}</div>;
}
