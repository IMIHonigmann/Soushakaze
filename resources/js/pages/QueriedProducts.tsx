import { Link, router } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaCartShopping, FaUser } from 'react-icons/fa6';
import { MdNavigateNext } from 'react-icons/md';
import SeparatingLine from './SeparatingLine';

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

export default function QueriedProducts({ weapons, message }: Props) {
    const categories = ['Up Close And Personal', 'Wick and Run', 'For COD Enjoyers', 'Yard Counters', 'Flex Throws'];
    const [clickedCategories, setClickedCategories] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(categories.map((c) => [c, false] as const)),
    );

    const formRef = useRef<HTMLFormElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = formRef.current;
        if (!form) return;
        const fd = new FormData(form);

        const checkedTypes = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="weaponTypes[]"]'))
            .filter((i) => i.checked)
            .map((i) => i.value);

        const params: Record<string, string | number | string[]> = {
            name: searchInputRef.current?.value ?? '',
            power_lowerlimit: Number(fd.get('powerMin') ?? 1),
            power_upperlimit: Number(fd.get('powerMax') ?? maxPower),
            rate_of_fire_lowerlimit: Number(fd.get('rofMin') ?? 1),
            rate_of_fire_upperlimit: Number(fd.get('rofMax') ?? maxRof),
            weaponTypes: checkedTypes,
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
        <div className="mx-32">
            <div className="group">
                <div className="grid grid-cols-[1fr_2fr_3fr_auto] items-center gap-16 py-8 text-xl">
                    <span onClick={() => router.get(route('queried-products'))} className="cursor-pointer text-4xl font-extrabold">
                        SOUSHA.KAZE
                    </span>
                    <div className="flex justify-between">
                        <span>Shop</span>
                        <span>On Sale</span>
                        <span>New Arrivals</span>
                        <span>Brands</span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                        <input
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    formRef.current?.requestSubmit();
                                }
                            }}
                            ref={searchInputRef}
                            className="w-full rounded-4xl border-2 p-4"
                            placeholder="🔎 Search for weapons..."
                        />
                        <FaSearch
                            className="cursor-pointer text-4xl transition-[colors_transform] hover:scale-110 hover:text-lime-400"
                            onClick={() => formRef.current?.requestSubmit()}
                        />
                    </div>
                    <div className="flex justify-between gap-6">
                        <FaCartShopping />
                        <FaUser />
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="mb-8 h-0.5 w-11/12 bg-gray-300 text-center opacity-50 transition-[width_opacity] group-hover:w-full group-hover:opacity-100" />
                </div>
            </div>
            <div className="grid grid-cols-4 justify-items-center gap-20">
                <div className="col-span-1">
                    {message && <h1 className="mb-8 text-5xl">'{message}'</h1>}
                    <form ref={formRef} onSubmit={handleSubmit} className="mb-0.5 flex flex-col gap-8">
                        <ul className="flex flex-col justify-between gap-2">
                            {categories.map((category, index) => {
                                return (
                                    <li onClick={() => setClickedCategories((prev) => ({ ...prev, [category]: !prev[category] }))} key={index}>
                                        <div className="flex -skew-x-12 cursor-pointer items-center justify-between border-2 p-2">
                                            {category}
                                            <MdNavigateNext className={`${clickedCategories[category] ? 'rotate-90' : ''} transition-transform`} />
                                        </div>
                                        <ul className={`ml-4 ${clickedCategories[category] ? '' : 'hidden'}`}>
                                            {['Type1', 'Type2', 'Type3'].map((wepType, j) => (
                                                <li key={j}>{wepType}</li>
                                            ))}{' '}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                        <SeparatingLine />
                        <ul className="grid grid-cols-2 items-center justify-center gap-2 text-center">
                            {['Electric', 'CO₂', 'Gas Blowback', 'Schreckschuss'].map((category, index) => (
                                <li
                                    className="translate-0 -skew-x-12 cursor-pointer border-2 p-4 transition-transform hover:-translate-1"
                                    key={index}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <SeparatingLine />
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
                        <SeparatingLine />
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
                        <br />
                        <div className="mt-2">
                            <button type="submit" className="btn">
                                Apply
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-span-3 col-start-2 grid grid-cols-3 gap-8 text-xl">
                    {weapons.map((weapon, id) => (
                        <Link className="group inline-block py-2 text-center" href={route('customizer', { weaponId: weapon.id })} key={id}>
                            <div className="flex scale-100 justify-center rounded-2xl border-2 px-44 py-40 transition-transform ease-out group-hover:scale-105">
                                <div className="flex items-center justify-center">🖼️</div>
                            </div>
                            <div className="mt-4 ml-6 flex flex-col gap-2">
                                <div className="block translate-y-0 text-left transition-transform group-hover:translate-y-1">{weapon.name}</div>

                                <div className="block translate-y-0 text-left transition-transform group-hover:translate-y-1">⭐⭐⭐⭐⭐ 4.5/5</div>
                                <div className="block translate-y-0 text-left transition-transform group-hover:translate-y-1">{'$999'}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
