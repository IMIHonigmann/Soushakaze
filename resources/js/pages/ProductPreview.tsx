import { Weapon } from '@/types/types';

type Props = {
    weapon: Weapon;
};

export default function ProductPreview({ weapon }: Props) {
    console.log(weapon);
    return <div>{weapon.name}</div>;
}
