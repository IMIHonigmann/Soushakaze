import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import CategoryItem from './CategoryItem';
import Navbar from './Navbar';

type Weapon = {
    id: number;
    avg_rating: string;
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
    console.log(weapons);
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

    const handlePowerChange = (values: number[]) => {
        const newMinValue = Math.max(0, Math.min(values[0], maxPower - POWER_MIN_DIFF));
        const newMaxValue = Math.max(newMinValue + POWER_MIN_DIFF, Math.min(values[1], maxPower));
        setPowerValues([newMinValue, newMaxValue]);
    };

    const handleRofChange = (values: number[]) => {
        const newMinValue = Math.max(0, Math.min(values[0], maxRof - ROF_MIN_DIFF));
        const newMaxValue = Math.max(newMinValue + ROF_MIN_DIFF, Math.min(values[1], maxRof));
        setRofValues([newMinValue, newMaxValue]);
    };

    function displayStars(unparsedRating: string) {
        const num = parseFloat(unparsedRating);
        if (isNaN(num) || num <= 0) return '';

        const rounded = Math.round(Math.max(0, Math.min(5, num)) * 2) / 2;
        const full = Math.floor(rounded);
        const hasHalf = rounded - full === 0.5;

        return '★'.repeat(full) + (hasHalf ? '½' : '') + '☆'.repeat(5 - full - Number(hasHalf));
    }

    return (
        <div className="mx-32">
            <Navbar formRef={formRef} upperSearchInputRef={searchInputRef} />
            <div className="grid grid-cols-4 justify-items-center gap-20">
                <div className="col-span-1">
                    {message && <h1 className="mb-8 text-5xl">'{message}'</h1>}
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="mb-0.5 flex flex-col [&>*]:py-10 [&>*]:transition-all [&>*+*]:border-t-2 [&>*:hover]:border-dashed [&>*:hover]:border-t-blue-400 [&>*:hover]:py-12 [&>*:hover+*]:border-dashed [&>*:hover+*]:border-t-blue-400"
                    >
                        <ul className="flex flex-col justify-between gap-2">
                            {categories.map((category) => (
                                <CategoryItem key={category} label={category}>
                                    {['Type1', 'Type2', 'Type3'].map((wepType, j) => (
                                        <li key={j}>{wepType}</li>
                                    ))}
                                </CategoryItem>
                            ))}
                        </ul>

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

                        {maxPower > POWER_MIN_DIFF && (
                            <div>
                                <div className="mt-4">
                                    <label className="block text-5xl">Power:</label>
                                    <label>
                                        Min:
                                        <input
                                            type="number"
                                            className="no-arrows ml-2 inline-block w-3/4"
                                            min={0}
                                            value={powerValues[0]}
                                            onChange={(e) => handlePowerChange([Number(e.target.value), powerValues[1]])}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Max:
                                        <input
                                            type="number"
                                            className="no-arrows ml-2 inline-block w-3/4"
                                            min={powerValues[0] + POWER_MIN_DIFF}
                                            max={maxPower}
                                            value={powerValues[1]}
                                            onChange={(e) => setPowerValues([powerValues[0], Number(e.target.value)])}
                                        />
                                    </label>
                                </div>
                                <Range
                                    values={powerValues}
                                    step={5}
                                    min={0}
                                    max={maxPower}
                                    onChange={handlePowerChange}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            className="mt-10 h-2 w-full rounded bg-gray-200"
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
                            </div>
                        )}
                        {maxRof > ROF_MIN_DIFF && (
                            <div>
                                <div className="mt-4">
                                    <label className="block text-5xl">Rate of Fire:</label>
                                    <label>
                                        Min:
                                        <input
                                            type="number"
                                            className="no-arrows ml-2 inline-block w-3/4"
                                            min={0}
                                            value={rofValues[0]}
                                            onChange={(e) => handleRofChange([Number(e.target.value), rofValues[1]])}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        Max:
                                        <input
                                            type="number"
                                            className="no-arrows ml-2 inline-block w-3/4"
                                            min={rofValues[0] + ROF_MIN_DIFF}
                                            max={maxRof}
                                            value={rofValues[1]}
                                            onChange={(e) => setRofValues([rofValues[0], Number(e.target.value)])}
                                        />
                                    </label>
                                </div>

                                <Range
                                    values={rofValues}
                                    step={5}
                                    min={0}
                                    max={maxRof}
                                    onChange={handleRofChange}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            className="mt-10 h-2 w-full rounded bg-gray-200"
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
                            </div>
                        )}
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
                </div>
                <div className="col-span-3 col-start-2 grid h-fit grid-cols-3 content-start gap-8 text-xl">
                    {weapons.map((weapon, id) => (
                        <Link className="group inline-block h-fit py-2 text-center" href={route('customizer', { weaponId: weapon.id })} key={id}>
                            <div className="flex scale-100 justify-center rounded-2xl border-2 px-44 py-40 transition-transform ease-out group-hover:scale-105">
                                <div className="flex items-center justify-center">🖼️</div>
                            </div>
                            <div className="mt-4 ml-6 flex flex-col gap-2">
                                <div className="block translate-y-0 text-left transition-transform group-hover:translate-y-1">{weapon.name}</div>

                                {!isNaN(parseFloat(weapon.avg_rating)) && (
                                    <div className="block translate-y-0 text-left transition-transform group-hover:translate-y-1">
                                        {displayStars(weapon.avg_rating)} {parseFloat(weapon.avg_rating).toFixed(1)}/5
                                    </div>
                                )}
                                <div className="block translate-y-0 text-left transition-transform group-hover:translate-y-1">{'$999'}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
