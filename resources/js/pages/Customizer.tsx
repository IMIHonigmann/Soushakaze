import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { useCartStore } from '@/stores/bagStores';
import { useCustomizerStore } from '@/stores/useCustomizerStore';
import { Attachment, Weapon } from '@/types/types';
import { Link } from '@inertiajs/react';
import { CameraControls } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/all';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { CiIceCream } from 'react-icons/ci';
import { FaAngleDoubleUp, FaAngleDown, FaAngleUp, FaCrosshairs } from 'react-icons/fa';
import { IoIosReturnLeft } from 'react-icons/io';
import { MdAddShoppingCart, MdOutlineCameraswitch } from 'react-icons/md';
import * as THREE from 'three';
import Count from './Counter';
import CustomizerScene from './CustomizerScene';

gsap.registerPlugin(ScrambleTextPlugin);

const statTypes = ['power', 'accuracy', 'mobility', 'handling', 'magsize', 'price'] as const;
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

    const weaponNameRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.to(
            weaponNameRef.current,
            {
                duration: 1.5,
                ease: 'none',
                scrambleText: {
                    text: weapon.name,
                    speed: 2,
                    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~',
                },
            },
            4,
        ).to(weaponNameRef.current, {
            duration: 1,
            ease: 'sine.out',
        });

        return () => {
            tl.kill();
        };
    }, [weapon.name]);

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
                    return total + (att ? Number(att[`${stat}_modifier`]) || 0 : 0);
                }, 0);
                return [stat, sum];
            }),
        ) as Record<Stats, number>;
    }, [selected, grouped]);

    function contextDependentStatModifier(stat: Stats) {
        if (currentAreaSelection === 'all' || currentAreaSelection === 'other') {
            return statModifiers[stat];
        }

        const areaAttachments = grouped[currentAreaSelection];
        const selectedId = selected[currentAreaSelection];

        if (!selectedId || !areaAttachments) return 0;

        const selectedAttachment = areaAttachments.find((a) => a.id === selectedId);
        return selectedAttachment ? Number(selectedAttachment[`${stat}_modifier`]) || 0 : 0;
    }

    return (
        <>
            <MdOutlineCameraswitch
                className={`scale absolute top-4 right-4 z-5 cursor-pointer text-7xl transition-transform duration-300 ${currentAreaSelection === 'all' ? 'translate-x-20 scale-50' : 'translate-x-0 hover:scale-125 hover:rotate-360 hover:ease-out'}`}
                onClick={() => setCurrentAreaSelection('all')}
            />
            <CustomizerScene
                weaponId={weapon.id}
                setCurrentAreaSelection={setCurrentAreaSelection}
                cameraControlsRef={cameraControlsRef}
            ></CustomizerScene>
            <div className="flex justify-center">
                <div
                    className={`absolute bottom-10 z-101 grid w-full ${currentAreaSelection === 'all' || currentAreaSelection === 'other' ? 'grid-cols-[75%_25%_0%]' : 'grid-cols-[60%_25%_15%]'} px-4 transition-all duration-200`}
                >
                    <div
                        className={`${currentAreaSelection === 'other' || currentAreaSelection === 'all' ? '' : ''} mx-auto flex max-w-full shrink basis-48 justify-center gap-4 px-40 transition-transform`}
                    >
                        {Object.entries(grouped).map(([area, attachments]) => (
                            <div
                                key={area}
                                style={{ transform: currentAreaSelection === area ? 'translateY(-1.25rem)' : '' }}
                                className={`z-30 flex h-40 ${currentAreaSelection === 'all' || currentAreaSelection === 'other' ? 'w-32' : 'w-24 min-w-24'} flex-col transition-all`}
                            >
                                <strong className="ml-1 w-full truncate text-sm uppercase">{area.charAt(0).toUpperCase() + area.slice(1)}</strong>
                                <button
                                    onClick={() => handleClickAttachmentArea(area as Area)}
                                    style={{ boxShadow: currentAreaSelection === area ? '0 0 10px rgba(249,115,22,0.7)' : undefined }}
                                    className="mt-2 flex flex-grow flex-col items-center rounded-sm border border-zinc-600 transition-all hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)] [&>*]:w-full"
                                >
                                    <div className="flex h-3/4 items-center justify-center rounded-t-sm bg-zinc-700">
                                        {selected[area] === 0 ? <AiOutlinePlus className="text-6xl" /> : <img alt={`Att-${selected[area]}`} />}
                                    </div>
                                    <div className="flex h-2/6 items-center justify-center rounded-b-sm border-t border-zinc-600 bg-zinc-800">
                                        <div
                                            className={`${selected[area] === 0 ? 'font-extrabold opacity-50' : 'opacity-100'} line-clamp-2 px-1 text-xs break-words uppercase`}
                                        >
                                            {selected[area] === 0 ? 'empty' : attachments.find((a) => a.id === selected[area])?.name}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto mb-[0.875rem] grid grid-cols-[80%_20%] transition-all">
                        <div className="flex flex-col gap-y-2 uppercase">
                            {statTypes.map((stat) => {
                                const skipItems = new Set(['magsize', 'price']);
                                if (skipItems.has(stat)) return;
                                return (
                                    <div key={stat} className="grid grid-cols-[15%_17.5%_47.5%] items-center gap-6">
                                        <span
                                            className={`${contextDependentStatModifier(stat) > 0 ? 'text-lime-400' : contextDependentStatModifier(stat) < 0 ? 'text-red-500' : ''} place-self-end font-extrabold transition-all duration-250`}
                                        >
                                            {weapon.type !== 'blade' ? (stat === 'power' ? 'firepower' : stat) : stat}
                                        </span>
                                        <div className="grid grid-cols-2 place-items-center items-center gap-2">
                                            <div className="relative h-6 w-6">
                                                <FaAngleUp
                                                    className={`${contextDependentStatModifier(stat) > 0 ? 'translate-y-0 text-lime-400 opacity-100' : 'translate-y-2 opacity-0'} text-2xl transition-all duration-250`}
                                                />
                                                <FaAngleDown
                                                    className={`${contextDependentStatModifier(stat) < 0 ? 'translate-y-0 text-red-500 opacity-100' : '-translate-y-2 opacity-0'} absolute inset-0 text-2xl transition-all duration-250`}
                                                />
                                            </div>
                                            <div
                                                className={`${contextDependentStatModifier(stat) === 0 ? 'translate-x-2 opacity-0' : ''} ${contextDependentStatModifier(stat) < 0 ? 'text-red-500' : contextDependentStatModifier(stat) > 0 ? 'text-lime-400' : 'text-white'} -skew-x-12 text-sm font-bold transition-all`}
                                            >
                                                {contextDependentStatModifier(stat) >= 0
                                                    ? `+${Math.round(contextDependentStatModifier(stat))}%`
                                                    : `${Math.round(contextDependentStatModifier(stat))}%`}
                                            </div>
                                        </div>
                                        <div className="relative flex h-3/4 w-full -skew-x-12 border">
                                            <div
                                                style={{
                                                    width:
                                                        stat === 'power'
                                                            ? `${(weapon['power'] / (maxPower + 1)) * 100}%`
                                                            : `${currentAreaSelection === 'all' || currentAreaSelection === 'other' ? weapon[stat] : weapon[stat] + statModifiers[stat] - contextDependentStatModifier(stat)}%`,
                                                }}
                                                className="relative z-30 h-full bg-white transition-all"
                                            >
                                                <div
                                                    style={{
                                                        width: `${Math.abs(Math.max(Math.min(contextDependentStatModifier(stat) / (weapon[stat] * 0.01), 0), -100))}%`,
                                                    }}
                                                    className="absolute right-0 h-full border-l bg-red-500 transition-all"
                                                />
                                            </div>
                                            <div
                                                style={{ width: `${Math.min(Math.max(contextDependentStatModifier(stat), 0), 100)}%` }}
                                                className="h-full bg-lime-400 transition-all"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {weapon.type !== 'blade' && (
                            <div className="grid w-3/4 grid-cols-1 font-extrabold">
                                <div>
                                    <div>Mags</div>
                                    <div className="-mt-1 text-4xl">{weapon.extra_mags}</div>
                                </div>
                                <div
                                    className={`${weapon.magsize + contextDependentStatModifier('magsize') > weapon.magsize ? 'text-lime-400' : weapon.magsize + contextDependentStatModifier('magsize') < weapon.magsize ? 'text-red-500' : ''} transition-all`}
                                >
                                    <div>Mag Size</div>
                                    <div className="flex">
                                        <div className="-mt-1 text-4xl">{weapon.magsize}</div>
                                        <div
                                            className={`${contextDependentStatModifier('magsize') !== 0 ? '' : 'translate-y-3 opacity-0'} -translate-y-1 -skew-x-12 transition-all`}
                                        >
                                            {contextDependentStatModifier('magsize') >= 0
                                                ? `+${contextDependentStatModifier('magsize')}`
                                                : contextDependentStatModifier('magsize')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* empty element for grid */}
                    <div />
                </div>
                <Link
                    className="group duration-all absolute top-1/2 -right-40 z-99 flex skew-x-12 cursor-pointer items-center divide-x-2 border bg-zinc-950 p-2 pr-4 transition-all duration-200 hover:-right-2 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)] [&>*]:px-2"
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
                    <MdAddShoppingCart className="-skew-x-12 text-6xl" />
                    <span className="ml-2 translate-x-[60vw] -skew-x-12 text-xl font-extrabold transition-transform duration-300 group-hover:translate-x-0">
                        ADD TO CART
                    </span>
                </Link>
            </div>
            <div
                style={{ backgroundColor: currentAreaSelection === 'other' || currentAreaSelection === 'all' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.3)' }}
                className="pointer-events-none absolute top-0 right-0 z-100 h-full w-screen transition-all duration-400"
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
                            <ul className="mx-2 flex flex-col divide-y-2 [&>*]:min-w-72 [&>*]:p-4">
                                <li
                                    key={`standard-${area}`}
                                    onClick={() => handleSelect(area as Area, 0)}
                                    className={`${selected[area] === 0 ? 'bg-red-600' : 'bg-transparent'} flex cursor-pointer items-center justify-start gap-4 transition-[background] duration-300 select-none hover:bg-red-600`}
                                >
                                    <div className="skew-x-4 border-2 bg-black">
                                        <CiIceCream className="p-2 text-6xl" />
                                    </div>
                                    <div className="text-xl">Factory Issue</div>
                                </li>
                                {attachments
                                    .sort((a1, a2) => a1.price_modifier - a2.price_modifier)
                                    .map((a) => (
                                        <li
                                            key={a.id}
                                            onClick={() => handleSelect(area as Area, a.id)}
                                            className={`${selected[area] === a.id ? 'bg-red-600' : 'bg-transparent'} flex cursor-pointer items-center gap-4 transition-all select-none hover:bg-red-600`}
                                        >
                                            <div className="relative skew-x-4 border-2 bg-black">
                                                <FaCrosshairs className="p-2 text-6xl" />
                                                <FaAngleDoubleUp className="absolute -right-2 -bottom-2 p-2 text-4xl" />
                                            </div>
                                            <div className="text-xl">
                                                <div>{a.name}</div>
                                                <div className="-skew-x-12 font-extrabold">{a.price_modifier}€</div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="absolute top-4 left-4 font-extrabold">
                    <h1 ref={weaponNameRef} className="font-hitmarker-condensed text-8xl font-extrabold text-shadow-white">
                        S0USHAK4Z3
                    </h1>
                    <div className="mt-1 text-xl">Total Price (inkl. Tax): </div>
                    <Count from={Number(weapon.price)} to={Number(weapon.price) + statModifiers['price']} />
                </div>
            </div>
        </>
    );
}
