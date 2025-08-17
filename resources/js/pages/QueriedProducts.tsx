import { Link, router } from '@inertiajs/react';
import { useMemo, useRef } from 'react';

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
    const formRef = useRef<HTMLFormElement | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = formRef.current;
        if (!form) return;
        const fd = new FormData(form);

        const wepTypesFilters: Record<Weapon['type'], boolean> = {};
        Array.from(form.querySelectorAll<HTMLInputElement>('input[name="weaponTypes[]"]')).forEach((input) => {
            wepTypesFilters[input.value] = input.checked;
        });

        const params: Record<string, number> = {
            power_lowerlimit: Number(fd.get('powerMin') ?? 1),
            power_upperlimit: Number(fd.get('powerMax') ?? maxPower),
            rate_of_fire_lowerlimit: Number(fd.get('rofMin') ?? 1),
            rate_of_fire_upperlimit: Number(fd.get('rofMax') ?? maxRof),
            ...wepTypesFilters,
        };

        const options = {
            preserveState: true,
            preserveScroll: true,
        };

        router.get(route('queried-products'), params, options);
    }

    const { maxPower, maxRof, weaponTypes } = useMemo(() => {
        let curMaxPower: number = 0;
        let curMaxRof: number = 0;

        const weaponTypeSet = new Set<string>(
            weapons.map((w) => {
                if (w.power > curMaxPower) curMaxPower = w.power;
                if (w.rate_of_fire > curMaxRof) curMaxRof = w.rate_of_fire;
                return w.type;
            }),
        );

        return {
            maxPower: Math.max(curMaxPower, 1),
            maxRof: Math.max(curMaxRof, 1),
            weaponTypes: Array.from(weaponTypeSet),
        };
    }, [weapons]);

    return (
        <>
            <h1>{searchQuery}</h1>
            <h2>{message}</h2>
            <br />
            <form ref={formRef} onSubmit={handleSubmit} className="mb-0.5">
                <label>
                    Power Min:
                    <input type="number" name="powerMin" className="ml-2" defaultValue={1} />
                </label>
                <label>
                    Power Max:
                    <input type="number" name="powerMax" className="ml-2" defaultValue={maxPower} />
                </label>
                <br />
                <label>
                    Rate of Fire Min:
                    <input type="number" name="rofMin" className="ml-2" defaultValue={1} />
                </label>
                <label>
                    Rate of Fire Max:
                    <input type="number" name="rofMax" className="ml-2" defaultValue={maxRof} />
                </label>
                <br />
                <div>
                    <label htmlFor="weaponTypes">Weapon Types:</label>
                    <div style={{ marginLeft: '0.5rem' }}>
                        {weaponTypes.map((wepType, idx) => (
                            <label className="block" key={idx}>
                                <input
                                    type="checkbox"
                                    className="mx-1"
                                    id={`weaponTypes_${wepType}`}
                                    name="weaponTypes[]"
                                    value={wepType}
                                    defaultChecked
                                />
                                {wepType[0].toUpperCase() + wepType.substring(1)}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="mt-2">
                    <button type="submit" className="btn">
                        Apply
                    </button>
                </div>
            </form>
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
