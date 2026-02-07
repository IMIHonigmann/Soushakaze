import { usePrevious } from '@/hooks/usePrevious';
import { playLower } from '@/pages/AttAudio';
import { useCartStore } from '@/stores/bagStores';
import { state, vec3 } from '@/stores/customizerProxy';
import { Area, Attachment, Weapon } from '@/types/types';
import { router } from '@inertiajs/react';
import { CameraControls } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/all';
import { PlusCircle } from 'lucide-react';
import React, { Activity, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsBoundingBox } from 'react-icons/bs';
import { FaChevronRight, FaChevronUp } from 'react-icons/fa';
import { GiDesertEagle } from 'react-icons/gi';
import { IconType } from 'react-icons/lib';
import { LuMousePointer, LuMove3D, LuRotate3D, LuScale3D } from 'react-icons/lu';
import { MdEdit } from 'react-icons/md';
import { TbBox, TbCamera } from 'react-icons/tb';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import ContextMenu from '../Editor/ContextMenu';
import EditForm from '../Editor/EditForm';
import { DynamicIcon } from './helpers';
import { MainCustomizer } from './MainCustomizer';

gsap.registerPlugin(ScrambleTextPlugin);

export const statTypes = ['power', 'accuracy', 'mobility', 'handling', 'magsize', 'price'] as const;
export type Stats = (typeof statTypes)[number];

interface Props {
    weapon: Weapon;
    maxPower: number;
    attachments: Record<string, Attachment[]>;
    query: Record<Area, number>;
    attachmentModels: Record<string, string[]>;
    areaDisplays: any;
}

export default function Customizer({ weapon, maxPower, attachments, query, areaDisplays, attachmentModels }: Props) {
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
            if (event.key === 'q' || event.key === 'Q') state.mode = undefined;
            if (event.key === 'w' || event.key === 'W') state.mode = 'translate';
            if (event.key === 'e' || event.key === 'E') state.mode = 'rotate';
            if (event.key === 'r' || event.key === 'R') state.mode = 'scale';
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

    const [openedAreaTabs, setOpenedAreaTabs] = useState<Record<string, { opened: boolean; selected: boolean }>>(() =>
        Object.fromEntries(Object.keys(attachments).map((area) => [area, { opened: true, selected: false }])),
    );

    const [openedAttTabs, setOpenedAttTabs] = useState<Record<string | number, { opened: boolean; selected: boolean }>>(() => {
        const result: Record<string | number, { opened: boolean; selected: boolean }> = {};
        Object.values(attachments).forEach((atts) => {
            atts.forEach((att) => {
                result[att.id] = { opened: true, selected: false };
            });
        });
        return result;
    });

    // use to create new tab state when adding a new attachment
    const getTabState = (id: string | number) => {
        return openedAttTabs[id] ?? { opened: true, selected: false };
    };

    const [attachmentClipboard, setAttachmentClipboard] = useState<Record<string, number[]>>();
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [actionFunctions, setActionFunctions] = useState<Record<string, (() => void) | -1> | null>(null);
    const [editFormData, setEditFormData] = useState<{
        Fields: Record<string, any>;
        TargetType: 'Area' | 'Attachment';
        targetName?: string;
    } | null>(null);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
        };

        const handleClick = () => setActionFunctions(null);

        // window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className="grid h-[98.5svh] w-[99svw] grid-cols-[17%_3%_80%] grid-rows-[35%_60%_5%] gap-2 bg-zinc-950 p-2 *:rounded-xl *:border [&>*:not(:nth-child(n+2):nth-child(-n+3),:last-child)]:p-2">
            <div className="row-start-1 overflow-scroll border-b">
                <div className={`animate-fade-from-below *:not-first:not-last:mb-2`}>
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
            <MainCustomizer
                attachmentModels={attachmentModels}
                areaDisplays={areaDisplays}
                weapon={weapon}
                cameraControlsRef={cameraControlsRef}
                contextDependentStatModifier={contextDependentStatModifier}
                maxPower={maxPower}
                statModifiers={statModifiers}
                addToBag={addToBag}
                totalPrice={totalPrice}
                AttachmentListElement={AttachmentListElement}
                isPlaying={isPlaying}
                weaponNameRef={weaponNameRef}
                previousPrice={previousPrice}
                setIsPlaying={setIsPlaying}
            />
            <ul
                ref={scrollDivRef}
                className={`animate-fade-from-above row-span-2 flex flex-col overflow-scroll p-4`}
                style={{ scrollBehavior: 'smooth' }}
            >
                {(() => {
                    return Object.entries(attachments).map(([area, atts], areaIndex) => (
                        <li key={area}>
                            <h3
                                onContextMenu={() => {
                                    setActionFunctions({
                                        'Add New Attachment': () => {
                                            setEditFormData({
                                                Fields: {
                                                    'Attachment Name': null,
                                                    'Price Modifier': null,
                                                    'Power Modifier': null,
                                                    'Accuracy Modifier': null,
                                                    'Mobility Modifier': null,
                                                    'Handling Modifier': null,
                                                    'Magsize Modifier': null,
                                                    Area: null,
                                                },
                                                TargetType: 'Attachment',
                                            });
                                        },
                                        'Edit Area Name': -1,
                                    });
                                }}
                                onClick={() =>
                                    setOpenedAreaTabs((prev) => ({
                                        ...prev,
                                        [area]: {
                                            ...prev[area],
                                            opened: !prev[area].opened,
                                        },
                                    }))
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-sm border-b-2 p-2 font-hitmarker-condensed text-3xl uppercase select-none hover:bg-red-600"
                            >
                                <span className="flex items-center gap-2">
                                    <FaChevronRight
                                        className={`${openedAreaTabs[area].opened ? 'rotate-90' : ''} text-lg transition-transform duration-300`}
                                    />
                                    <TbCamera />
                                </span>
                                <span className={`transition-all ${openedAreaTabs[area].opened ? 'ml-2' : ''}`}>{area}</span>
                            </h3>
                            <ul
                                className={`overflow-scroll transition-all duration-300 ease-out *:ml-6 ${openedAreaTabs[area].opened ? '' : 'h-0 opacity-0'}`}
                            >
                                {atts.map((att, attIndex) => (
                                    <li key={att.id}>
                                        <h4
                                            onClick={() => {
                                                state.action = 'CHANGESELECTION';
                                                state.currentMesh.previousSelection = [...snap.currentMesh.existingSelection];
                                                state.currentMesh.existingSelection = [...snap.dbAttachmentsToMaterialsObject[att.name]];
                                                state.currentMesh.lastSelection = [...snap.dbAttachmentsToMaterialsObject[att.name]];
                                                state.lastUpdateId++;
                                            }}
                                            onContextMenu={() => {
                                                setActionFunctions({
                                                    'Cut Model Selection': -1,
                                                    'Paste Model Selection': () => {
                                                        if (!attachmentClipboard || Object.keys(attachmentClipboard).length === 0) {
                                                            console.error('The Attachment Clipboard is empty!');
                                                            return;
                                                        }
                                                        Object.entries(attachmentClipboard).forEach(([attNodeArrayIdentifier, nodeIndices]) => {
                                                            const sortedIndices = [...nodeIndices].sort((a, b) => b - a);
                                                            sortedIndices.forEach((nodeIndex) => {
                                                                if (!state.dbAttachmentsToMaterialsObject[att.name])
                                                                    state.dbAttachmentsToMaterialsObject[att.name] = [];

                                                                state.dbAttachmentsToMaterialsObject[att.name].push(
                                                                    snap.dbAttachmentsToMaterialsObject[attNodeArrayIdentifier][nodeIndex],
                                                                );
                                                            });

                                                            sortedIndices.forEach((nodeIndex) => {
                                                                state.dbAttachmentsToMaterialsObject[attNodeArrayIdentifier].splice(nodeIndex, 1);
                                                            });
                                                        });

                                                        setAttachmentClipboard(undefined);
                                                    },
                                                    'Edit Model Name': -1,
                                                });
                                            }}
                                            className={`group flex cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-sm p-2 transition-transform duration-300 ease-out hover:bg-red-600`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <FaChevronRight
                                                    onClick={() =>
                                                        setOpenedAttTabs((prev) => {
                                                            const current = prev[att.id] ?? { opened: true, selected: false };
                                                            getTabState(att.id);
                                                            return {
                                                                ...prev,
                                                                [att.id]: {
                                                                    ...current,
                                                                    opened: !current.opened,
                                                                },
                                                            };
                                                        })
                                                    }
                                                    className={`${getTabState(att.id).opened ? 'rotate-90' : ''} text-lg transition-transform duration-300 hover:bg-black`}
                                                />
                                                <GiDesertEagle className="text-2xl" />
                                                <span className="text-xl">{att.name}</span>
                                            </span>
                                            <MdEdit
                                                onClick={() => {
                                                    setEditFormData({
                                                        Fields: {
                                                            'Attachment Name': att.name,
                                                            'Price Modifier': att.price_modifier,
                                                            'Power Modifier': att.power_modifier,
                                                            'Accuracy Modifier': att.accuracy_modifier,
                                                            'Mobility Modifier': att.mobility_modifier,
                                                            'Handling Modifier': att.handling_modifier,
                                                            'Magsize Modifier': att.handling_modifier,
                                                            Area: att.area,
                                                        },
                                                        TargetType: 'Attachment',
                                                        targetName: att.name,
                                                    });
                                                }}
                                                className="hidden border p-0.5 opacity-0 transition-all group-hover:inline-block group-hover:opacity-100 hover:bg-black"
                                            />
                                        </h4>
                                        <ul
                                            className={`ml-6 overflow-hidden transition-all duration-300 ease-out ${getTabState(att.id).opened ? '' : 'h-0 opacity-0'} `}
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
                                                        className={`rounded-sm select-none ${activeClickedLi?.dataset.nodename === nodeName ? 'bg-purple-500 text-black' : snap.currentMesh.existingSelection.includes(nodeName) ? 'bg-orange-500 text-black' : 'cursor-pointer hover:bg-red-600'} ${attachmentClipboard?.[att.name]?.includes(modelIndex) ? 'opacity-50' : ''}`}
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
                                                        onContextMenu={() => {
                                                            setActionFunctions({
                                                                'Cut Model Selection': function () {
                                                                    setAttachmentClipboard((prev) => ({
                                                                        ...prev,
                                                                        [att.name]: [modelIndex],
                                                                    }));
                                                                    const curAttClip: typeof attachmentClipboard = {};
                                                                    snap.currentMesh.existingSelection.forEach((nodeName) => {
                                                                        if (!curAttClip[att.name]) curAttClip[att.name] = [];
                                                                        curAttClip[att.name].push(
                                                                            snap.dbAttachmentsToMaterialsObject[att.name].indexOf(nodeName),
                                                                        );
                                                                        setAttachmentClipboard(curAttClip);
                                                                    });
                                                                },
                                                                'Paste Model Selection': -1,
                                                            });
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
                                                            <span className="truncate">{nodeName}</span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                ))}
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
                <button
                    onClick={() => {
                        router.post('/overwriteAttachmentModelHierarchy', {
                            dbAttachmentsToMaterialsObject: JSON.stringify(snap.dbAttachmentsToMaterialsObject),
                            weapon_id: weapon.id,
                        });
                    }}
                    className="mr-2 border p-1 hover:bg-zinc-900"
                >
                    Apply
                </button>
            </div>

            {actionFunctions && <ContextMenu actionFunctions={actionFunctions} x={contextMenuPosition.x} y={contextMenuPosition.y} />}

            <Activity mode={editFormData ? 'visible' : 'hidden'}>
                <EditForm setEditFormData={setEditFormData} editFormData={editFormData} attachments={attachments} />
            </Activity>
        </div>
    );
}
