import { Link } from '@inertiajs/react';

type Weapon = {
    id: number;
    name: string;
    rate_of_fire: number;
    type: string;
    power: number;
};

type Props = {
    searchQuery: string;
    weapons: Weapon[];
    message: string;
};

export default function QueriedProducts({ searchQuery, weapons, message }: Props) {
    return (
        <>
            <h1>{searchQuery}</h1>
            <h2>{message}</h2>
            <br />
            {weapons.map((weapon, id) => (
                <>
                    <Link
                        className="inline-block origin-left scale-100 transition-transform hover:scale-110"
                        href={route('customizer', { weaponId: weapon.id })}
                        key={id}
                    >
                        {weapon.name}
                    </Link>
                    <br />
                </>
            ))}
        </>
    );
}
