import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { usePrevious } from '@/hooks/usePrevious';
import { useCartStore } from '@/stores/bagStores';
import { Area, factoryIssueAttachment, useCustomizerStore } from '@/stores/useCustomizerStore';
import { Attachment, Weapon } from '@/types/types';
import { Link } from '@inertiajs/react';
import { CameraControls } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/all';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { CiIceCream } from 'react-icons/ci';
import { FaAngleDoubleUp, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { FaBoltLightning } from 'react-icons/fa6';
import { GiBlackHandShield, GiCornerExplosion, GiCrosshair, GiFeather, GiHeavyBullets, GiStarFormation } from 'react-icons/gi';
import { IoIosReturnLeft } from 'react-icons/io';
import { MdAddShoppingCart, MdOutlineCameraswitch } from 'react-icons/md';
import * as THREE from 'three';
import { playLower } from '../AttAudio';
import Count from '../Counter';
import CustomizerScene from '../CustomizerScene';
import YouTubePlayer from '../YouTubePlayer';

gsap.registerPlugin(ScrambleTextPlugin);

const statTypes = ['power', 'accuracy', 'mobility', 'handling', 'magsize', 'price'] as const;
export type Stats = (typeof statTypes)[number];

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

    const [isPlaying, setIsPlaying] = useState(false);

    const { selected, currentAreaSelection, setSelected, setCurrentAreaSelection } = useCustomizerStore();
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

    const handleSelect = (area: Area, attachment: Attachment, sound = 'select_attachment_subtle') => {
        if (selected[area].id !== attachment.id) playLower(`/sounds/${sound}.mp3`);
        setSelected(area, attachment);
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
        if (currentAreaSelection === 'all' || currentAreaSelection === 'other') {
            playLower('/sounds/switchto_attachments.mp3');
        } else if (currentAreaSelection !== area) {
            playLower('/sounds/switch_attachment_area.mp3');
        }
        setCurrentAreaSelection(area);
    }

    const statModifiers: Record<Stats, number> = useMemo(() => {
        return Object.fromEntries(
            statTypes.map((stat) => {
                const sum = Object.values(selected).reduce((total, att) => {
                    return total + (att ? Number(att[`${stat}_modifier`]) || 0 : 0);
                }, 0);
                return [stat, sum];
            }),
        ) as Record<Stats, number>;
    }, [selected]);

    const contextModifiers = useMemo(() => {
        if (currentAreaSelection === 'all' || currentAreaSelection === 'other') {
            return statModifiers;
        }

        const selectedAtt = selected[currentAreaSelection];

        return Object.fromEntries(statTypes.map((stat) => [stat, selectedAtt ? Number(selectedAtt[`${stat}_modifier`]) || 0 : 0])) as Record<
            Stats,
            number
        >;
    }, [currentAreaSelection, selected, statModifiers]);

    function contextDependentStatModifier(stat: Stats) {
        return contextModifiers[stat];
    }

    const totalPrice = useMemo(() => {
        return Number(weapon.price) + statModifiers['price'];
    }, [statModifiers, weapon.price]);

    const previousPrice = usePrevious(totalPrice);

    const myPlaylist: string[] = ['53S_ZAvWT3o', '9knRIIQGUb4', 'XGLYpYoXkWw', '5Duje_sZko8', 'HMuYfScGpbE'];

    function DynamicIcon({ children, className }: { children: React.ReactNode; className?: string }) {
        const childArray = React.Children.toArray(children).filter(Boolean);
        const childCount = childArray.length;

        return (
            <div className={`relative h-16 w-16 border-2 bg-black ${className}`}>
                <div
                    className={`relative z-10 grid h-full w-full grid-cols-2 grid-rows-2 [&>*]:p-2 ${
                        childCount === 2
                            ? 'place-items-center gap-0 p-2.5 text-5xl [&>*:first-child]:col-start-2 [&>*:last-child]:col-start-1 [&>*:last-child]:row-start-2'
                            : childCount === 3
                              ? 'place-items-center p-2 text-5xl [&>*:last-child]:col-span-2 [&>*:last-child]:justify-self-center'
                              : childCount === 4
                                ? 'place-items-center text-5xl'
                                : 'text-6xl'
                    }`}
                >
                    {childCount >= 5 ? <GiStarFormation className="text-yellow-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]" /> : children}
                </div>
                <div className="absolute -right-0.5 bottom-0 z-20 rounded-full p-1">
                    {childArray.length > 0 &&
                        childArray.length < 4 &&
                        (childArray[0] as any).props?.id !== 'factory_issue' &&
                        (childCount > 1 ? (
                            <FaAngleDoubleUp className="text-xl text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]" />
                        ) : (
                            <FaBoltLightning className="text-xl text-yellow-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]" />
                        ))}
                </div>
            </div>
        );
    }

    function AttachmentListElement({ area, att, children, sound }: { area: Area; att: Attachment; children?: React.ReactNode; sound?: string }) {
        return (
            <li
                key={`attachment-${area}-${att.id}`}
                onClick={() => handleSelect(area as Area, att, sound)}
                className="group relative flex cursor-pointer items-center gap-4 overflow-hidden border border-transparent transition-shadow select-none hover:border-red-600 hover:shadow-[0_0_40px_rgba(249,115,22,0.9)]"
            >
                <div
                    className={`absolute inset-0 bg-gradient-to-l from-orange-500 to-transparent transition-opacity duration-200 ${selected[area]?.id === att.id ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-red-600 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <div className="pointer-events-none relative z-10 flex items-center gap-4">
                    <DynamicIcon
                        className={`skew-x-3 transition-transform duration-150 ease-out group-hover:scale-105 ${selected[area].id === att.id ? 'scale-110' : ''}`}
                    >
                        {children}
                    </DynamicIcon>
                    <div className="text-xl">
                        <div>{att.name}</div>
                        {att.id !== 0 && <div className="-skew-x-12 font-extrabold">{att.price_modifier}€</div>}
                    </div>
                </div>
            </li>
        );
    }

    return (
        <>
            <MdOutlineCameraswitch
                className={`scale absolute top-4 right-4 z-70 cursor-pointer text-7xl transition-transform duration-300 ${currentAreaSelection === 'all' ? 'translate-x-20 scale-50' : 'translate-x-0 hover:scale-125 hover:rotate-360 hover:ease-out'}`}
                onClick={() => goBackTo3D('all')}
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
                    <ul
                        className={`${currentAreaSelection === 'other' || currentAreaSelection === 'all' ? '' : ''} mx-auto flex max-w-full shrink basis-48 justify-center gap-4 px-40 transition-transform`}
                    >
                        {Object.entries(grouped).map(([area]) => {
                            const a = selected[area];
                            return (
                                <li
                                    key={area}
                                    style={{ transform: currentAreaSelection === area ? 'translateY(-1.25rem)' : '' }}
                                    className={`z-30 flex h-40 ${currentAreaSelection === 'all' || currentAreaSelection === 'other' ? 'w-32' : 'w-24 min-w-24'} flex-col transition-all`}
                                >
                                    <strong className="ml-1 w-full truncate text-sm uppercase">{area.charAt(0).toUpperCase() + area.slice(1)}</strong>
                                    <button
                                        onClick={() => handleClickAttachmentArea(area as Area)}
                                        className={`mt-2 flex flex-grow flex-col items-center rounded-sm border ${currentAreaSelection !== 'all' && currentAreaSelection !== 'other' ? 'border-b-2 border-b-orange-400' : ''} ${currentAreaSelection === area && currentAreaSelection !== 'other' && currentAreaSelection !== 'all' ? 'shadow-[0_10px_15px_-5px_rgba(249,115,22,0.7)]' : ''} border-zinc-600 transition-all duration-150 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)] [&>*]:w-full`}
                                    >
                                        <div className="flex h-3/4 items-center justify-center overflow-hidden rounded-t-sm bg-zinc-700">
                                            <div key={selected[area]?.id} className="animate-fade-from-below">
                                                {selected[area]?.id === 0 ? (
                                                    <AiOutlinePlus className="text-6xl" />
                                                ) : (
                                                    <DynamicIcon className="scale-125">
                                                        {a.power_modifier > 0 && <GiCornerExplosion />}
                                                        {a.mobility_modifier > 0 && <GiFeather />}
                                                        {a.accuracy_modifier > 0 && <GiCrosshair className="z-2" />}
                                                        {a.handling_modifier > 0 && <GiBlackHandShield className="z-3" />}
                                                        {a.magsize_modifier > 0 && <GiHeavyBullets />}
                                                    </DynamicIcon>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex h-2/6 items-center justify-center overflow-x-hidden rounded-b-sm border-t border-zinc-600 bg-zinc-800">
                                            <h3
                                                key={selected[area]?.id}
                                                className={`${selected[area]?.id === 0 ? 'font-extrabold opacity-50' : 'opacity-100'} animate-fade-from-left line-clamp-2 px-1 text-xs break-words uppercase`}
                                            >
                                                {selected[area]?.id === 0 ? 'empty' : selected[area]?.name}
                                            </h3>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
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
                            customizedPrice: totalPrice,
                            weapon: weapon,
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
                            className="absolute top-0 right-0 z-190 h-full border-l bg-black transition-all duration-300"
                        >
                            <div className="m-4 flex items-center justify-between">
                                <div className="relative">
                                    <strong className="font-hitmarker-condensed text-2xl tracking-widest uppercase select-none">{area}</strong>
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 origin-left ${currentAreaSelection === area ? 'scale-x-100' : 'scale-x-0'} transform bg-orange-500 transition-transform duration-1000`}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <IoIosReturnLeft
                                    onClick={() => goBackTo3D('other')}
                                    className="hover:animate-simonsaysahh cursor-pointer rounded-full border-4 text-5xl transition-all hover:scale-110 hover:text-red-600"
                                />
                            </div>
                            <ul className="-mr-2 flex flex-col divide-y-2 [&>*]:min-w-72 [&>*]:py-4 [&>*]:pr-12 [&>*]:pl-6">
                                <AttachmentListElement area={area as Area} att={factoryIssueAttachment} sound="select_attachment">
                                    <CiIceCream id="factory_issue" />
                                </AttachmentListElement>
                                {attachments
                                    .sort((a1, a2) => a1.price_modifier - a2.price_modifier)
                                    .map((a) => (
                                        <AttachmentListElement key={a.id} area={area as Area} att={a}>
                                            {a.power_modifier > 0 && <GiCornerExplosion />}
                                            {a.mobility_modifier > 0 && <GiFeather />}
                                            {a.accuracy_modifier > 0 && <GiCrosshair className="z-2" />}
                                            {a.handling_modifier > 0 && <GiBlackHandShield className="z-3" />}
                                            {a.magsize_modifier > 0 && <GiHeavyBullets />}
                                        </AttachmentListElement>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="pointer-events-auto absolute top-4 left-4 font-extrabold">
                    <div className={`${isPlaying ? '' : 'opacity-0'} transition-opacity duration-300`}>
                        <div className={`pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-orange-600/10`} />
                    </div>
                    <h1 ref={weaponNameRef} className="font-hitmarker-condensed text-8xl font-extrabold text-shadow-white">
                        S0USHAK4Z3
                    </h1>
                    <div className="z-10 mt-1 text-xl">Total Price (inkl. Tax): </div>
                    <Count className="ml-1" from={previousPrice ?? totalPrice} to={totalPrice} />
                </div>
                <YouTubePlayer
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    className={`pointer-events-none z-200 flex -translate-y-10/12 flex-col items-center justify-center transition-all hover:translate-0 ${isPlaying ? 'animate-beat hover:animate-none' : ''}`}
                    videoIds={myPlaylist}
                />
            </div>
        </>
    );

    function goBackTo3D(area: Area): void {
        playLower('/sounds/switchto_selection_all.mp3');
        setCurrentAreaSelection(area);
    }
}
