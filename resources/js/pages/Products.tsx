import { Link } from '@inertiajs/react';

type Weapon = {
    id: number;
    name: string;
    rate_of_fire: number;
    type: string;
    power: number;
};

type Props = {
    weapons: Weapon[];
};

export default function Products({ weapons }: Props) {
    console.log(weapons);
    return (
        <>
            {weapons.map((weapon, id) => (
                <Link href={route('customizer', { weaponId: weapon.id })} key={id}>
                    {weapon.name}
                    <br />
                </Link>
            ))}
        </>
    );
}
