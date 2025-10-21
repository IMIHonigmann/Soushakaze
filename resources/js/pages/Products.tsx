import { Weapon } from '@/types/types';
import { Link, router } from '@inertiajs/react';
import { Fragment } from 'react/jsx-runtime';

type Props = {
    weapons: Weapon[];
};

export default function Products({ weapons }: Props) {
    console.log(weapons);

    function logout() {
        router.post(route('logout'));
    }

    return (
        <>
            {weapons.map((weapon, id) => (
                <Fragment key={id}>
                    <Link
                        className="inline-block origin-left scale-100 transition-transform hover:scale-110"
                        href={route('customizer', { weaponId: weapon.id })}
                        key={id}
                    >
                        {weapon.name}
                    </Link>
                    <br />
                </Fragment>
            ))}

            <br />
            <button onClick={() => logout()}> LOG OUT </button>
        </>
    );
}
