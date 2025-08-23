import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaCartShopping, FaUser } from 'react-icons/fa6';
import { Range, getTrackBackground } from 'react-range';
import CategoryItem from './CategoryItem';
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

    const [powerValues, setPowerValues] = useState([1, maxPower]);
    const [rofValues, setRofValues] = useState([1, maxRof]);

    useEffect(() => {
        setPowerValues([1, maxPower]);
        setRofValues([1, maxRof]);
    }, [maxPower, maxRof]);

    const POWER_MIN_DIFF = 50;
    const ROF_MIN_DIFF = 10;

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
                            {categories.map((category) => (
                                <CategoryItem key={category} label={category}>
                                    {['Type1', 'Type2', 'Type3'].map((wepType, j) => (
                                        <li key={j}>{wepType}</li>
                                    ))}
                                </CategoryItem>
                            ))}
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
                        <div className="mt-4">
                            <label className="block text-5xl">Power:</label>
                            <label>
                                Min:
                                <input
                                    min={0}
                                    max={powerValues[1] - POWER_MIN_DIFF}
                                    type="number"
                                    value={powerValues[0]}
                                    onChange={(e) => setPowerValues((p) => [Number(e.target.value), p[1]])}
                                />
                            </label>
                            <br />
                            <label>
                                Max:
                                <input
                                    min={powerValues[0] + POWER_MIN_DIFF}
                                    max={maxPower}
                                    type="number"
                                    value={powerValues[1]}
                                    onChange={(e) => setPowerValues((p) => [p[0], Number(e.target.value)])}
                                />
                            </label>
                        </div>
                        <Range
                            values={powerValues}
                            step={5}
                            min={0}
                            max={maxPower}
                            onChange={(values) => {
                                if (values[1] - values[0] > POWER_MIN_DIFF) {
                                    setPowerValues(values);
                                }
                            }}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="mt-2 h-2 w-full rounded bg-gray-200"
                                    style={{
                                        background: getTrackBackground({
                                            values: powerValues,
                                            colors: ['#ccc', '#4F46E5', '#ccc'],
                                            min: 0,
                                            max: maxPower,
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props, isDragged, index }) => (
                                <div
                                    {...props}
                                    className={`h-5 w-5 rounded-full bg-white transition-shadow focus:outline-none ${
                                        isDragged ? 'shadow-[0_0_12px_5px_rgba(79,70,229,0.8)]' : 'shadow-[0_0_8px_3px_rgba(79,70,229,0.6)]'
                                    }`}
                                >
                                    <div
                                        className={`absolute -top-7 -left-2 text-xs transition-transform ${isDragged ? 'scale-100' : 'translate-x-1 translate-y-2 scale-0'}`}
                                    >
                                        {powerValues[index]}
                                    </div>
                                </div>
                            )}
                        />
                        <SeparatingLine />

                        <div className="mt-4">
                            <label className="block text-5xl">Rate of Fire:</label>
                            <label>
                                Min:
                                <input
                                    type="number"
                                    min={0}
                                    max={rofValues[1] - ROF_MIN_DIFF}
                                    value={rofValues[0]}
                                    onChange={(e) => setRofValues((p) => [Number(e.target.value), p[1]])}
                                />
                            </label>
                            <br />
                            <label>
                                Max:
                                <input
                                    type="number"
                                    min={rofValues[0] + ROF_MIN_DIFF}
                                    max={maxRof}
                                    value={rofValues[1]}
                                    onChange={(e) => setRofValues((p) => [p[0], Number(e.target.value)])}
                                />
                            </label>
                        </div>

                        <Range
                            values={rofValues}
                            step={5}
                            min={0}
                            max={maxRof}
                            onChange={(values) => {
                                if (values[1] - values[0] > ROF_MIN_DIFF) {
                                    setRofValues(values);
                                }
                            }}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="mt-2 h-2 w-full rounded bg-gray-200"
                                    style={{
                                        background: getTrackBackground({
                                            values: rofValues,
                                            colors: ['#ccc', '#4F46E5', '#ccc'],
                                            min: 0,
                                            max: maxRof,
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props, isDragged, index }) => (
                                <div
                                    {...props}
                                    className={`h-5 w-5 rounded-full bg-white transition-shadow focus:outline-none ${
                                        isDragged ? 'shadow-[0_0_12px_5px_rgba(79,70,229,0.8)]' : 'shadow-[0_0_8px_3px_rgba(79,70,229,0.6)]'
                                    }`}
                                >
                                    <div
                                        className={`absolute -top-7 -left-2 text-xs transition-transform ${isDragged ? 'scale-100' : 'translate-x-1 translate-y-2 scale-0'}`}
                                    >
                                        {rofValues[index]}
                                    </div>
                                </div>
                            )}
                        />

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
                <div className="col-span-3 col-start-2 grid h-fit grid-cols-3 content-start gap-8 text-xl">
                    {weapons.map((weapon, id) => (
                        <Link className="group inline-block h-fit py-2 text-center" href={route('customizer', { weaponId: weapon.id })} key={id}>
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
