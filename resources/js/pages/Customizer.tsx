import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { useCartStore } from '@/stores/bagStores';
import { useCustomizerStore } from '@/stores/useCustomizerStore';
import { Weapon } from '@/types/types';
import { Link } from '@inertiajs/react';
import { CameraControls } from '@react-three/drei';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { CiIceCream } from 'react-icons/ci';
import { FaAngleDoubleUp, FaAngleDown, FaAngleUp, FaCrosshairs } from 'react-icons/fa';
import { IoIosReturnLeft } from 'react-icons/io';
import { MdOutlineCameraswitch } from 'react-icons/md';
import * as THREE from 'three';
import CustomizerScene from './CustomizerScene';

export type Attachment = {
    id: number;
    seller_id?: number | null;
    manufacturer_id?: number | null;
    name: string;
    price: number;
    area: Area;
    image_blob?: string | null; // base64 or URL depending on API
    power_modifier: number;
    accuracy_modifier: number;
    mobility_modifier: number;
    handling_modifier: number;
    created_at?: string;
    updated_at?: string;
};

const statTypes = ['power', 'accuracy', 'mobility', 'handling'] as const;
export type Stats = (typeof statTypes)[number];

export type Area = 'muzzle' | 'scope' | 'magazine' | 'grip' | 'stock' | 'barrel' | 'laser' | 'flashlight' | 'bipod' | 'underbarrel' | 'other' | 'all';

interface Props {
    weapon: Weapon;
    maxPower: number;
    attachments: Attachment[];
}

export default function Customizer({ weapon, maxPower, attachments }: Props) {
    const cameraControlsRef = useRef<CameraControls>(null);
    const grouped = attachments.reduce<Record<string, Attachment[]>>((acc, att) => {
        acc[att.area] = acc[att.area] || [];
        acc[att.area].push(att);
        return acc;
    }, {});

    const { selected, currentAreaSelection, setSelected, setCurrentAreaSelection, initializeSelections } = useCustomizerStore();
    const { addToBag } = useCartStore((state) => state);

    useEffect(() => {
        initializeSelections(grouped);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = (area: Area, id: number) => {
        setSelected(area, id);
        setCurrentAreaSelection(area);
    };

    const setCameraControls = useCallback(
        (target: THREE.Vector3, pos: THREE.Vector3) => {
            if (!cameraControlsRef.current) return;

            cameraControlsRef.current.setTarget(target.x, target.y, target.z, true);
            cameraControlsRef.current.setPosition(pos.x, pos.y, pos.z, true);
        },
        [cameraControlsRef],
    );

    const vec3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);
    useMemo(() => {
        const CAMERA_POSITIONS: Partial<Record<Area, [THREE.Vector3, THREE.Vector3]>> = {
            stock: [vec3(0, 0, 0), vec3(-5, 0, 3)],
            magazine: [vec3(1.5, -0.75, 0), vec3(0, -1, 3)],
            scope: [vec3(0.75, 1, 0), vec3(-1.5, 1.75, 1.5)],
            underbarrel: [vec3(2, 0.45, 0), vec3(3.5, 2, -2)],
            all: [vec3(0, -0.35, 0), vec3(0, 0, 5)],
        };

        const [target, position] = CAMERA_POSITIONS[currentAreaSelection] ?? CAMERA_POSITIONS.all!;
        if (currentAreaSelection === 'other') return;
        setCameraControls(target, position);
    }, [currentAreaSelection, setCameraControls]);

    function handleClickAttachmentArea(area: Area) {
        setCurrentAreaSelection(area);
    }

    const statModifiers: Record<Stats, number> = useMemo(() => {
        return Object.fromEntries(
            statTypes.map((stat) => {
                const sum = Object.entries(grouped).reduce((total, [area, attachments]) => {
                    const id = selected[area];
                    if (!id) return total;
                    const att = attachments.find((a) => a.id === id);
                    return total + (att ? att[`${stat}_modifier`] : 0);
                }, 0);
                return [stat, sum];
            }),
        ) as Record<Stats, number>;
    }, [selected, grouped]);

    return (
        <>
            <MdOutlineCameraswitch
                className={`scale absolute top-4 left-4 z-10 cursor-pointer text-7xl transition-transform duration-300 ${currentAreaSelection === 'all' ? '-translate-x-20 scale-50' : 'translate-x-0 hover:scale-125 hover:rotate-360 hover:ease-out'}`}
                onClick={() => setCurrentAreaSelection('all')}
            />
            <CustomizerScene
                weaponId={weapon.id}
                setCurrentAreaSelection={setCurrentAreaSelection}
                cameraControlsRef={cameraControlsRef}
            ></CustomizerScene>
            <div className="flex justify-center">
                <div className="absolute bottom-10 grid w-full grid-cols-[70%_30%] px-4 transition-transform">
                    <div
                        className={`${currentAreaSelection === 'other' || currentAreaSelection === 'all' ? '' : 'translate-y-[30vh]'} mx-auto flex max-w-3xl justify-center gap-4 transition-transform`}
                    >
                        {Object.entries(grouped).map(([area, attachments]) => {
                            return (
                                <div
                                    key={area}
                                    style={{ transform: currentAreaSelection === area ? 'translateY(-1.25rem)' : '' }}
                                    className="z-30 flex aspect-square w-48 flex-col items-stretch transition-all"
                                >
                                    <strong className="ml-1 w-full truncate uppercase">{area.charAt(0).toUpperCase() + area.slice(1)}</strong>
                                    <button
                                        onClick={() => handleClickAttachmentArea(area as Area)}
                                        style={{ boxShadow: currentAreaSelection === area ? '0 0 10px rgba(249,115,22,0.7)' : undefined }}
                                        className="mt-2 flex flex-grow flex-col items-center rounded-sm border border-zinc-600 transition-shadow hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)] [&>*]:w-full"
                                    >
                                        <div className="flex h-3/4 items-center justify-center rounded-t-sm bg-zinc-700">
                                            {selected[area] === 0 ? <AiOutlinePlus className="text-6xl" /> : <img alt="img" />}
                                        </div>
                                        <div className="flex h-1/4 items-center justify-center rounded-b-sm border-t border-zinc-600 bg-zinc-800">
                                            <div
                                                className={`${selected[area] === 0 ? 'font-extrabold opacity-50' : 'opacity-100'} text-xs uppercase`}
                                            >
                                                {selected[area] === 0 ? 'empty' : attachments.find((a) => a.id === selected[area])?.name}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div
                        className={`${currentAreaSelection === 'other' || currentAreaSelection === 'all' ? '' : '-translate-x-[35vw]'} z-30 mt-auto mb-[0.875rem] grid grid-cols-[80%_20%] transition-all`}
                    >
                        <div className="flex flex-col gap-2 uppercase">
                            {statTypes.map((stat) => {
                                console.log('Stat Mods:', statModifiers[stat]);
                                return (
                                    <div key={stat} className="grid grid-cols-[20%_15%_70%] items-center gap-4">
                                        <span
                                            className={`${statModifiers[stat] > 0 ? 'text-lime-400' : statModifiers[stat] < 0 ? 'text-red-500' : ''} transition-all duration-250`}
                                        >
                                            {stat}
                                        </span>
                                        <div className="grid grid-cols-2 items-center gap-2">
                                            <div className="relative h-6 w-6">
                                                <FaAngleUp
                                                    className={`${statModifiers[stat] > 0 ? 'translate-y-0 text-lime-400 opacity-100' : 'translate-y-2 opacity-0'} text-2xl transition-all duration-250`}
                                                />
                                                <FaAngleDown
                                                    className={`${statModifiers[stat] < 0 ? 'translate-y-0 text-red-500 opacity-100' : '-translate-y-2 opacity-0'} absolute inset-0 text-2xl transition-all duration-250`}
                                                />
                                            </div>
                                            <div
                                                className={`${statModifiers[stat] === 0 ? 'translate-x-2 opacity-0' : ''} ${statModifiers[stat] < 0 ? 'text-red-500' : statModifiers[stat] > 0 ? 'text-lime-400' : 'text-white'} text-sm font-bold transition-all`}
                                            >
                                                {statModifiers[stat] >= 0
                                                    ? `+${Math.round(statModifiers[stat])}%`
                                                    : `${Math.round(statModifiers[stat])}%`}
                                            </div>
                                        </div>
                                        <div className="relative flex h-3/4 w-3/4 border">
                                            <div
                                                style={{
                                                    width: stat === 'power' ? `${(weapon['power'] / (maxPower + 1)) * 100}%` : `${weapon[stat]}%`,
                                                }}
                                                className="relative z-30 h-full bg-white"
                                            >
                                                <div
                                                    style={{ width: `${Math.abs(Math.min(statModifiers[stat], 0))}%` }}
                                                    className="absolute right-0 h-full border-l bg-red-500 transition-all"
                                                />
                                            </div>
                                            <div
                                                style={{ width: `${Math.max(0, statModifiers[stat])}%` }}
                                                className="h-full bg-lime-400 transition-all"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-1 font-extrabold [&>*]:-skew-x-6">
                            <div>
                                <div>Mags</div>
                                <div className="-mt-1 text-4xl">5</div>
                            </div>
                            <div>
                                <div>Mag Size</div>
                                <div className="-mt-1 text-4xl">30</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link
                    className="cursor-pointer"
                    onClick={() =>
                        addToBag({
                            customizedWeaponId: makeSelectionKey(weapon.id, { ...selected }),
                            weaponId: weapon.id,
                            weaponName: weapon.name,
                            selectedAttachments: { ...selected },
                            quantity: 1,
                        })
                    }
                    href={route('cart')}
                >
                    ADD TO CART
                </Link>
            </div>
            <div
                style={{ backgroundColor: currentAreaSelection === 'other' || currentAreaSelection === 'all' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.3)' }}
                className="pointer-events-none absolute top-0 right-0 h-full w-screen transition-all duration-400"
            >
                {/* Attachment Selection List */}
                <div>
                    {Object.entries(grouped).map(([area, attachments]) => (
                        <div
                            key={area}
                            style={{
                                transform: `translateX(${currentAreaSelection === 'all' || currentAreaSelection === 'other' ? '20vw' : '0vw'})`,
                                opacity: currentAreaSelection === area ? 1 : 0,
                                pointerEvents: currentAreaSelection === area ? 'auto' : 'none',
                                right: currentAreaSelection === area ? '0' : '-30%',
                            }}
                            className="absolute top-0 right-0 h-full border-l bg-black transition-all duration-300"
                        >
                            <div className="m-4 flex items-center justify-between">
                                <div className="relative">
                                    <strong className="text-xl tracking-widest uppercase select-none">{area}</strong>
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 origin-left ${currentAreaSelection === area ? 'scale-x-100' : 'scale-x-0'} transform bg-orange-500 transition-transform duration-1000`}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <IoIosReturnLeft
                                    onClick={() => setCurrentAreaSelection('other')}
                                    className="hover:animate-simonsaysahh cursor-pointer rounded-full border-4 text-5xl transition-all hover:scale-110 hover:text-red-600"
                                />
                            </div>
                            <ul className="mx-2 flex flex-col divide-y-2 [&>*]:min-w-80 [&>*]:p-4">
                                <li
                                    key={`standard-${area}`}
                                    onClick={() => handleSelect(area as Area, 0)}
                                    className={`${selected[area] === 0 ? 'bg-red-600' : 'bg-transparent'} flex cursor-pointer items-center justify-start gap-4 transition-[background] duration-300 select-none hover:bg-red-600`}
                                >
                                    <div className="border-2 bg-black">
                                        <CiIceCream className="p-2 text-6xl" />
                                    </div>
                                    <div className="text-xl">Factory Issue</div>
                                </li>
                                {attachments.map((a) => (
                                    <li
                                        key={a.id}
                                        onClick={() => handleSelect(area as Area, a.id)}
                                        className={`${selected[area] === a.id ? 'bg-red-600' : 'bg-transparent'} flex cursor-pointer items-center gap-4 transition-all select-none hover:bg-red-600`}
                                    >
                                        <div className="relative border-2 bg-black">
                                            <FaCrosshairs className="p-2 text-6xl" />
                                            <FaAngleDoubleUp className="absolute -right-2 -bottom-2 p-2 text-4xl" />
                                        </div>
                                        <div className="text-xl">{a.name}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
