import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { usePrevious } from '@/hooks/usePrevious';
import { playLower } from '@/pages/AttAudio';
import Count from '@/pages/Counter';
import YouTubePlayer from '@/pages/YouTubePlayer';
import { useCartStore } from '@/stores/bagStores';
import { factoryIssueAttachment, state, vec3 } from '@/stores/customizerProxy';
import { Area, Attachment, Weapon } from '@/types/types';
import { Link } from '@inertiajs/react';
import { CameraControls } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/all';
import { PlusCircle } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsBoundingBox } from 'react-icons/bs';
import { CiIceCream } from 'react-icons/ci';
import { FaAngleDoubleUp, FaAngleDown, FaAngleUp, FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { FaBoltLightning } from 'react-icons/fa6';
import { GiBlackHandShield, GiCornerExplosion, GiCrosshair, GiDesertEagle, GiFeather, GiHeavyBullets, GiStarFormation } from 'react-icons/gi';
import { IoIosReturnLeft } from 'react-icons/io';
import { IconType } from 'react-icons/lib';
import { LuMousePointer, LuMove3D, LuRotate3D, LuScale3D } from 'react-icons/lu';
import { MdAddShoppingCart, MdEdit, MdOutlineCameraswitch } from 'react-icons/md';
import { TbBox, TbCamera } from 'react-icons/tb';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import CustomizerScene from './CustomizerScene';

gsap.registerPlugin(ScrambleTextPlugin);

const statTypes = ['power', 'accuracy', 'mobility', 'handling', 'magsize', 'price'] as const;
export type Stats = (typeof statTypes)[number];

interface Props {
    weapon: Weapon;
    maxPower: number;
    attachments: Record<string, Attachment[]>;
    query: Record<Area, number>;
}

export default function Customizer({ weapon, maxPower, attachments, query }: Props) {
    const cameraControlsRef = useRef<CameraControls>(null);
    state.grouped = attachments;
    const [isPlaying, setIsPlaying] = useState(false);

    const { addToBag } = useCartStore((state) => state);

    useEffect(() => {
        const availableAreas = new Set(Object.keys(snap.grouped));
        const newSelected = Object.fromEntries(Object.entries(snap.selected).filter(([area]) => availableAreas.has(area)));
        state.selected = newSelected;
        const queryAttachmentIds = Object.entries(query);
        queryAttachmentIds.forEach(([area, attId]) => {
            const att = snap.grouped[area]?.find((a) => a.id == attId);
            if (!att) return;
            state.selected[area] = att;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const snap = useSnapshot(state);

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

    const updateQueryParams = (area: Area, attachmentId: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set(area, attachmentId.toString());
        window.history.replaceState({}, '', url);
    };
    const handleSelect = (area: Area, attachment: Attachment, sound = 'select_attachment_subtle') => {
        if (snap.selected[area].id !== attachment.id) playLower(`/sounds/${sound}.mp3`);
        state.selected[area] = attachment;
        updateQueryParams(area, attachment.id);
        state.currentAreaSelection = area;
    };

    const setCameraControls = useCallback(
        (target: THREE.Vector3, pos: THREE.Vector3) => {
            if (!cameraControlsRef.current) return;

            cameraControlsRef.current.setTarget(target.x, target.y, target.z, true);
            cameraControlsRef.current.setPosition(pos.x, pos.y, pos.z, true);
        },
        [cameraControlsRef],
    );

    useMemo(() => {
        const [target, position] = snap.CAMERA_POSITIONS[snap.currentAreaSelection] ?? snap.CAMERA_POSITIONS.all!;
        if (snap.currentAreaSelection === 'other') return;
        setCameraControls(target, position);
    }, [setCameraControls, snap.CAMERA_POSITIONS, snap.currentAreaSelection]);

    function handleClickAttachmentArea(area: Area) {
        if (snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other') {
            playLower('/sounds/switchto_attachments.mp3');
        } else if (snap.currentAreaSelection !== area) {
            playLower('/sounds/switch_attachment_area.mp3');
        }
        state.currentAreaSelection = area;
    }

    const statModifiers: Record<Stats, number> = useMemo(() => {
        return Object.fromEntries(
            statTypes.map((stat) => {
                const sum = Object.values(snap.selected).reduce((total, att) => {
                    return total + (att ? Number(att[`${stat}_modifier`]) || 0 : 0);
                }, 0);
                return [stat, sum];
            }),
        ) as Record<Stats, number>;
    }, [snap.selected]);

    const contextModifiers = useMemo(() => {
        if (snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other') {
            return statModifiers;
        }

        const selectedAtt = snap.selected[state.currentAreaSelection];

        return Object.fromEntries(statTypes.map((stat) => [stat, selectedAtt ? Number(selectedAtt[`${stat}_modifier`]) || 0 : 0])) as Record<
            Stats,
            number
        >;
    }, [snap.currentAreaSelection, snap.selected, statModifiers]);

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
                    className={`relative z-10 grid h-full w-full grid-cols-2 grid-rows-2 *:p-2 ${
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
                    className={`absolute inset-0 bg-linear-to-l from-orange-500 to-transparent transition-opacity duration-200 ${snap.selected[area]?.id === att.id ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-linear-to-l from-red-600 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <div className="pointer-events-none relative z-10 flex items-center gap-4">
                    <DynamicIcon
                        className={`skew-x-3 transition-transform duration-150 ease-out group-hover:scale-105 ${snap.selected[area].id === att.id ? 'scale-110' : ''}`}
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

    const [clickedSidebarTab, setClickedSidebarTab] = useState(0);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'q') state.mode = undefined;
            if (event.key === 'w') state.mode = 'translate';
            if (event.key === 'e') state.mode = 'rotate';
            if (event.key === 'r') state.mode = 'scale';
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const liRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const [activeClickedLi, setActiveClickedLi] = useState<HTMLLIElement | null>(null);
    const scrollDivRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        const selectedElement = Object.values(liRefs.current).find((element) => element?.dataset.index === String(snap.currentMesh.lastSelection));
        const selectedIndex = selectedElement?.dataset.index;
        if (selectedIndex && liRefs.current[selectedIndex]) {
            liRefs.current[selectedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
        if (snap.currentMesh.lastSelection.length === 1 && selectedElement) setActiveClickedLi(selectedElement);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snap.lastListSearchId, snap.nodeNames]);

    const [openedAreaTabs, setOpenedAreaTabs] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(Object.keys(attachments).map((area) => [area, true])),
    );
    const [openedAttTabs, setOpenedAttTabs] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(Object.values(attachments).map((atts) => atts.map((att) => [att.id, false]))),
    );

    useEffect(() => {
        console.log('active', activeClickedLi);
    }, [activeClickedLi]);

    return (
        <div className="grid h-[98.5svh] w-[99svw] grid-cols-[17%_3%_80%] grid-rows-[35%_60%_5%] gap-2 bg-zinc-950 p-2 *:rounded-xl *:border [&>*:not(:nth-child(n+2):nth-child(-n+3),:last-child)]:p-2">
            <div className="row-start-1 overflow-scroll border-b">
                <div
                    className={`animate-fade-from-below *:not-first:not-last:mb-2 ${!(snap.currentAreaSelection === 'other' || snap.currentAreaSelection === 'all') ? 'block' : 'hidden'}`}
                >
                    <div className="text-3xl">
                        <h1 className="font-hitmarker-condensed uppercase">{snap.currentAreaSelection}</h1>
                        <h2>Camera Transforms</h2>
                    </div>
                    {['Target', 'Position'].map((element, index) => {
                        function handleCamChange(
                            e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
                            axis: 'x' | 'y' | 'z',
                        ) {
                            if (!state.CAMERA_POSITIONS[snap.currentAreaSelection]) {
                                state.CAMERA_POSITIONS[snap.currentAreaSelection] = [vec3(0, 0, 0), vec3(0, 0, 0)];
                            }
                            const camPos = state.CAMERA_POSITIONS[snap.currentAreaSelection]!;
                            if (camPos[index]) {
                                camPos[index][axis] = Number(e.currentTarget.value) || 0;
                                setCameraControls(camPos[0], camPos[1]);
                            }
                        }

                        return (
                            <div className="mx-2 grid grid-cols-[30%_70%] justify-end" key={element}>
                                <h3>{element}:</h3>
                                <span className="grid grid-cols-3 gap-4 *:border">
                                    {(['x', 'y', 'z'] as const).map((axis) => (
                                        <>
                                            <input
                                                key={`${snap.currentAreaSelection}-${element}-X`}
                                                placeholder="0"
                                                type="number"
                                                style={{ MozAppearance: 'textfield' }}
                                                onSelect={(e) => e.currentTarget.select()}
                                                defaultValue={snap.CAMERA_POSITIONS[snap.currentAreaSelection]?.[index]?.[axis]?.toString() ?? ''}
                                                onBlur={(e) => {
                                                    handleCamChange(e, axis);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleCamChange(e, axis);
                                                }}
                                            />
                                        </>
                                    ))}
                                </span>
                            </div>
                        );
                    })}
                    <button className="block w-full rounded-sm bg-orange-500 p-2 text-black transition-all hover:invert">Reset</button>
                </div>
            </div>
            <ul className="row-span-full flex flex-col gap-1 p-1">
                {[1, 2, 3, 4, 5].map((num, index) => (
                    <li
                        onClick={() => setClickedSidebarTab(index)}
                        key={num}
                        className={`flex aspect-square items-center justify-center rounded-lg border transition-colors duration-150 ${clickedSidebarTab === index ? 'bg-red-600' : 'cursor-pointer bg-zinc-900 hover:bg-orange-500'}`}
                    >
                        <span>{num}</span>
                    </li>
                ))}
            </ul>
            <div className="relative row-span-2 overflow-hidden">
                <MdOutlineCameraswitch
                    className={`scale absolute top-4 right-4 z-70 cursor-pointer text-7xl transition-transform duration-300 ${snap.currentAreaSelection === 'all' ? 'translate-x-20 scale-50' : 'translate-x-0 hover:scale-125 hover:rotate-360 hover:ease-out'}`}
                    onClick={() => goBackTo3D('all')}
                />
                <CustomizerScene weapon={weapon} cameraControlsRef={cameraControlsRef}></CustomizerScene>
                <div className="flex justify-center">
                    <div
                        className={`absolute bottom-10 z-101 grid w-full ${snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other' ? 'grid-cols-[75%_25%_0%]' : 'grid-cols-[60%_25%_15%]'} px-4 transition-all duration-200`}
                    >
                        <ul
                            className={`${snap.currentAreaSelection === 'other' || state.currentAreaSelection === 'all' ? '' : ''} mx-auto flex max-w-full shrink basis-48 justify-center gap-4 px-40 transition-transform`}
                        >
                            {Object.entries(snap.grouped).map(([area]) => {
                                const a = snap.selected[area];
                                return (
                                    <li
                                        key={area}
                                        style={{ transform: snap.currentAreaSelection === area ? 'translateY(-1.25rem)' : '' }}
                                        className={`z-30 flex h-40 ${snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other' ? 'w-32' : 'w-24 min-w-24'} flex-col transition-all`}
                                    >
                                        <strong className="ml-1 w-full truncate text-sm uppercase">
                                            {area.charAt(0).toUpperCase() + area.slice(1)}
                                        </strong>
                                        <button
                                            onClick={() => handleClickAttachmentArea(area as Area)}
                                            className={`mt-2 flex grow flex-col items-center rounded-sm border ${snap.currentAreaSelection !== 'all' && state.currentAreaSelection !== 'other' ? 'border-b-2 border-b-orange-400' : ''} ${state.currentAreaSelection === area && state.currentAreaSelection !== 'other' && state.currentAreaSelection !== 'all' ? 'shadow-[0_10px_15px_-5px_rgba(249,115,22,0.7)]' : ''} border-zinc-600 transition-all duration-150 *:w-full hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]`}
                                        >
                                            <div className="flex h-3/4 items-center justify-center overflow-hidden rounded-t-sm bg-zinc-700">
                                                <div key={snap.selected[area]?.id} className="animate-fade-from-below">
                                                    {snap.selected[area]?.id === 0 ? (
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
                                                    key={snap.selected[area]?.id}
                                                    className={`${snap.selected[area]?.id === 0 ? 'font-extrabold opacity-50' : 'opacity-100'} animate-fade-from-left line-clamp-2 px-1 text-xs wrap-break-word uppercase`}
                                                >
                                                    {snap.selected[area]?.id === 0 ? 'empty' : state.selected[area]?.name}
                                                </h3>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="mt-auto mb-3.5 grid grid-cols-[80%_20%] transition-all">
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
                                                                : `${snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other' ? weapon[stat] : weapon[stat] + statModifiers[stat] - contextDependentStatModifier(stat)}%`,
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
                        className="group duration-all absolute top-1/2 -right-40 z-99 flex skew-x-12 cursor-pointer items-center divide-x-2 border bg-zinc-950 p-2 pr-4 transition-all duration-200 *:px-2 hover:-right-2 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]"
                        onClick={() =>
                            addToBag({
                                customizedWeaponId: makeSelectionKey(weapon.id, { ...snap.selected }),
                                customizedPrice: totalPrice,
                                weapon: weapon,
                                selectedAttachments: { ...snap.selected },
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
                    style={{
                        backgroundColor:
                            snap.currentAreaSelection === 'other' || state.currentAreaSelection === 'all' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.3)',
                    }}
                    className="pointer-events-none absolute top-0 right-0 z-100 h-full w-full transition-all duration-400"
                >
                    {/* Attachment Selection List */}
                    <div>
                        {Object.entries(snap.grouped).map(([area, attachments]) => (
                            <div
                                key={area}
                                style={{
                                    transform: `translateX(${snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other' ? '20vw' : '0vw'})`,
                                    opacity: snap.currentAreaSelection === area ? 1 : 0,
                                    pointerEvents: snap.currentAreaSelection === area ? 'auto' : 'none',
                                    right: snap.currentAreaSelection === area ? '0' : '-30%',
                                }}
                                className="absolute top-0 right-0 z-190 h-full border-l bg-black transition-all duration-300"
                            >
                                <div className="m-4 flex items-center justify-between">
                                    <div className="relative">
                                        <strong className="font-hitmarker-condensed text-2xl tracking-widest uppercase select-none">{area}</strong>
                                        <span
                                            className={`absolute -bottom-1 left-0 h-0.5 origin-left ${snap.currentAreaSelection === area ? 'scale-x-100' : 'scale-x-0'} transform bg-orange-500 transition-transform duration-1000`}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <IoIosReturnLeft
                                        onClick={() => goBackTo3D('other')}
                                        className="hover:animate-simonsaysahh cursor-pointer rounded-full border-4 text-5xl transition-all hover:scale-110 hover:text-red-600"
                                    />
                                </div>
                                <ul className="-mr-2 flex flex-col divide-y-2 *:min-w-72 *:py-4 *:pr-12 *:pl-6">
                                    <AttachmentListElement area={area as Area} att={factoryIssueAttachment} sound="select_attachment">
                                        <CiIceCream id="factory_issue" />
                                    </AttachmentListElement>
                                    {attachments.map((a) => (
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
                            <div className={`pointer-events-none fixed inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-orange-600/10`} />
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
            </div>
            <ul
                ref={scrollDivRef}
                className={`animate-fade-from-above row-span-2 flex flex-col overflow-scroll p-4 ${snap.currentAreaSelection === 'other' || snap.currentAreaSelection === 'all' ? 'block' : 'hidden'}`}
                style={{ scrollBehavior: 'smooth' }}
            >
                {(() => {
                    return Object.entries(attachments).map(([area, atts], areaIndex) => (
                        <li key={area}>
                            <h3
                                onClick={() => setOpenedAreaTabs((prev) => ({ ...prev, [area]: !prev[area] }))}
                                className="flex cursor-pointer items-center gap-2 rounded-sm border-b-2 p-2 font-hitmarker-condensed text-3xl uppercase select-none hover:bg-red-600"
                            >
                                <span className="flex items-center gap-2">
                                    <FaChevronRight
                                        className={`${openedAreaTabs[area] ? 'rotate-90' : ''} text-lg transition-transform duration-300`}
                                    />
                                    <TbCamera />
                                </span>
                                <span className={`transition-all ${openedAreaTabs[area] ? 'ml-2' : ''}`}>{area}</span>
                            </h3>
                            <ul
                                className={`overflow-scroll transition-all duration-300 ease-out *:ml-6 ${openedAreaTabs[area] ? '' : 'h-0 opacity-0'}`}
                            >
                                {atts.map((att, attIndex) => (
                                    <li key={att.id}>
                                        <h4
                                            onClick={() => setOpenedAttTabs((prev) => ({ ...prev, [att.id]: !prev[att.id] }))}
                                            className={`group flex cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-sm p-2 transition-transform duration-300 ease-out hover:bg-red-600`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <FaChevronRight
                                                    className={`${openedAttTabs[att.id] ? 'rotate-90' : ''} text-lg transition-transform duration-300`}
                                                />
                                                <GiDesertEagle className="text-2xl" />
                                                <span className="text-xl">{att.name}</span>
                                            </span>
                                            <MdEdit className="hidden border p-0.5 opacity-0 transition-all group-hover:inline-block group-hover:opacity-100 hover:bg-black" />
                                        </h4>
                                        <ul
                                            className={`ml-6 overflow-hidden transition-all duration-300 ease-out ${openedAttTabs[att.id] ? '' : 'h-0 opacity-0'} `}
                                        >
                                            {(snap.dbAttachmentsToMaterialsObject[att.name] ?? []).map((nodeName, modelIndex) => {
                                                const index = `${areaIndex}-${attIndex}-${modelIndex}`;
                                                return (
                                                    <li
                                                        data-index={index}
                                                        data-nodename={nodeName}
                                                        ref={(el) => {
                                                            liRefs.current[index] = el;
                                                        }}
                                                        tabIndex={0}
                                                        className={`rounded-sm select-none ${activeClickedLi?.dataset.nodename === nodeName ? 'bg-purple-500 text-black' : snap.currentMesh.existingSelection.includes(nodeName) ? 'bg-orange-500 text-black' : 'cursor-pointer hover:bg-red-600'}`}
                                                        onClick={(e) => {
                                                            state.currentMesh.previousSelection = [...state.currentMesh.existingSelection];
                                                            if (!activeClickedLi) setActiveClickedLi(e.currentTarget);
                                                            state.currentMesh.previousSelection = [...state.currentMesh.existingSelection];
                                                            state.currentMesh.existingSelection = [];
                                                            state.currentMesh.lastSelection = [];
                                                            state.action = 'CHANGESELECTION';

                                                            if (e.shiftKey) {
                                                                const clickedIndex = e.currentTarget.dataset.index;
                                                                const thirdClickedNumber = Number(clickedIndex?.match(/(\d+)-(\d+)-(\d+)$/)?.[3]);
                                                                const activeIndex = activeClickedLi?.dataset.index;
                                                                const thirdNumber = Number(activeIndex?.match(/(\d+)-(\d+)-(\d+)$/)?.[3]);
                                                                for (
                                                                    let i = Math.min(thirdNumber, thirdClickedNumber);
                                                                    i <= Math.max(thirdNumber, thirdClickedNumber);
                                                                    i++
                                                                ) {
                                                                    const nodeName =
                                                                        liRefs.current[`${areaIndex}-${attIndex}-${i}`]?.dataset.nodename;
                                                                    console.log('found?', nodeName);
                                                                    if (nodeName) {
                                                                        state.currentMesh.existingSelection.push(nodeName);
                                                                        state.currentMesh.lastSelection.push(nodeName);
                                                                    }
                                                                }
                                                            } else {
                                                                state.currentMesh.existingSelection = [nodeName];
                                                                state.currentMesh.lastSelection = [nodeName];
                                                                setActiveClickedLi(e.currentTarget);
                                                            }

                                                            state.lastUpdateId++;
                                                        }}
                                                        onKeyDown={(e: React.KeyboardEvent<HTMLLIElement>) => {
                                                            state.action = 'CHANGESELECTION';
                                                            if (e.key === 'ArrowUp') {
                                                                state.currentMesh.previousSelection = state.currentMesh.existingSelection;
                                                                // state.currentMesh.existingSelection = [snap.nodeNames[index - 1]];
                                                                // state.currentMesh.lastSelection = [snap.nodeNames[index - 1]];
                                                                // liRefs.current[index - 1]?.focus();
                                                            }
                                                            if (e.key === 'ArrowDown') {
                                                                state.currentMesh.previousSelection = state.currentMesh.existingSelection;
                                                                // state.currentMesh.existingSelection = [snap.nodeNames[index + 1]];
                                                                // state.currentMesh.lastSelection = [snap.nodeNames[index + 1]];
                                                                // liRefs.current[index + 1]?.focus();
                                                            }
                                                            state.lastUpdateId++;
                                                        }}
                                                        key={nodeName}
                                                    >
                                                        <div
                                                            className={`flex items-center gap-2 p-1 transition-all ${
                                                                activeClickedLi?.dataset.nodename === nodeName
                                                                    ? 'ml-8 select-none'
                                                                    : snap.currentMesh.lastSelection.includes(nodeName)
                                                                      ? 'ml-4 select-none'
                                                                      : 'ml-2'
                                                            }`}
                                                        >
                                                            <TbBox className="inline-block text-3xl" />
                                                            <span>{nodeName}</span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            <li className="flex cursor-pointer items-center gap-2 rounded-sm p-2 font-hitmarker-condensed text-orange-500 uppercase select-none hover:invert">
                                                <PlusCircle /> <span>Add New Model</span>
                                            </li>
                                        </ul>
                                    </li>
                                ))}
                                <li className="flex cursor-pointer items-center gap-2 rounded-sm p-2 font-hitmarker-condensed text-orange-500 uppercase select-none hover:invert">
                                    <PlusCircle /> <span>Add New Attachment</span>
                                </li>
                            </ul>
                        </li>
                    ));
                })()}
                <li className="flex cursor-pointer items-center gap-2 rounded-sm p-2 font-hitmarker-condensed text-3xl text-orange-500 uppercase select-none hover:invert">
                    <PlusCircle /> <span>Add New Area</span>
                </li>
            </ul>

            <div className="col-start-3 flex items-center justify-between">
                <span className="flex">
                    {(
                        [
                            [LuMousePointer, undefined],
                            [LuMove3D, 'translate'],
                            [LuRotate3D, 'rotate'],
                            [LuScale3D, 'scale'],
                        ] as [IconType, typeof state.mode][]
                    ).map(([IconComponent, mode]) => (
                        <IconComponent
                            key={mode ?? 'select'}
                            className={`h-full w-12 origin-bottom rounded-xl p-2 transition-transform duration-150 hover:text-black ${snap.mode === mode ? 'bg-orange-500 text-black' : 'cursor-pointer hover:bg-red-600'}`}
                            onClick={() => (state.mode = mode as typeof state.mode)}
                        />
                    ))}
                </span>
                <span className="m-4 flex items-center gap-2 rounded-xl border p-2">
                    <BsBoundingBox />
                    Bounding Box Center
                    <FaChevronUp />
                </span>
                <span>Apply</span>
            </div>
        </div>
    );

    function goBackTo3D(area: Area): void {
        playLower('/sounds/switchto_selection_all.mp3');
        state.currentAreaSelection = area;
    }
}
