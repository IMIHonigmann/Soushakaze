import { makeSelectionKey } from '@/helpers/makeSelectionKey';
import { playLower } from '@/pages/AttAudio';
import Count from '@/pages/Counter';
import YouTubePlayer from '@/pages/YouTubePlayer';
import { factoryIssueAttachment, state } from '@/stores/customizerProxy';
import { Area } from '@/types/types';
import { Link } from 'lucide-react';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { CiIceCream } from 'react-icons/ci';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { GiBlackHandShield, GiCornerExplosion, GiCrosshair, GiFeather, GiHeavyBullets } from 'react-icons/gi';
import { IoIosReturnLeft } from 'react-icons/io';
import { MdAddShoppingCart, MdOutlineCameraswitch } from 'react-icons/md';
import { useSnapshot } from 'valtio';
import { AttachmentListElement } from './AttachmentListElement';
import { statTypes } from './Customizer';
import CustomizerScene from './CustomizerScene';
import { DynamicIcon } from './DynamicIcon';

type MainCustomizerProps = {
    attachmentModels: any;
    areaDisplays: any;
    weapon: any;
    cameraControlsRef: any;
    statModifiers: any;
    contextDependentStatModifier: any;
    addToBag: any;
    maxPower: any;
    totalPrice: any;
    previousPrice: any;
    weaponNameRef: any;
};

export function MainCustomizer({
    attachmentModels,
    areaDisplays,
    weapon,
    cameraControlsRef,
    statModifiers,
    contextDependentStatModifier,
    maxPower,
    addToBag,
    totalPrice,
    previousPrice,
    weaponNameRef,
}: MainCustomizerProps) {
    const snap = useSnapshot(state);
    const myPlaylist: string[] = ['53S_ZAvWT3o', '9knRIIQGUb4', 'XGLYpYoXkWw', '5Duje_sZko8', 'HMuYfScGpbE'];
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="relative row-span-2 overflow-hidden">
            <MdOutlineCameraswitch
                className={`scale absolute top-4 right-4 z-70 cursor-pointer text-7xl transition-transform duration-300 ${snap.currentAreaSelection === 'all' ? 'translate-x-20 scale-50' : 'translate-x-0 hover:scale-125 hover:rotate-360 hover:ease-out'}`}
                onClick={() => goBackTo3D('all')}
            />
            <CustomizerScene
                attachmentModels={attachmentModels}
                areaDisplays={areaDisplays}
                weapon={weapon}
                cameraControlsRef={cameraControlsRef}
            ></CustomizerScene>
            <div
                className={`absolute bottom-0 z-101 grid w-full ${snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other' ? 'grid-cols-[70%_30%_0%]' : 'grid-cols-[52%_28%_15%]'} pointer-events-none h-full grid-rows-4 px-4 transition-all duration-200`}
            >
                <ul
                    className={`${snap.currentAreaSelection === 'other' || state.currentAreaSelection === 'all' ? '' : ''} row-start-4 mt-auto mb-10 flex max-w-full basis-48 gap-4 px-40 transition-transform`}
                >
                    {Object.entries(snap.grouped).map(([area]) => {
                        const a = snap.selected[area];
                        if (area === 'other' || area === 'all') return;
                        return (
                            <li
                                key={area}
                                style={{ transform: snap.currentAreaSelection === area ? 'translateY(-1.25rem)' : '' }}
                                className={`pointer-events-auto z-30 flex h-40 ${snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other' ? 'w-32' : 'w-24 min-w-24'} flex-col transition-all`}
                            >
                                <strong className="ml-1 w-full truncate text-sm uppercase">{area.charAt(0).toUpperCase() + area.slice(1)}</strong>
                                <button
                                    onClick={() => handleClickAttachmentArea(snap, area as Area)}
                                    className={`mt-2 flex grow flex-col items-center overflow-hidden rounded-sm border ${snap.currentAreaSelection !== 'all' && state.currentAreaSelection !== 'other' ? 'border-b-2 border-b-orange-400' : ''} ${state.currentAreaSelection === area && state.currentAreaSelection !== 'other' && state.currentAreaSelection !== 'all' ? 'shadow-[0_10px_15px_-5px_rgba(249,115,22,0.7)]' : ''} border-zinc-600 transition-all duration-150 *:w-full hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]`}
                                >
                                    <div className="flex h-3/4 items-center justify-center overflow-hidden bg-zinc-700">
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
                                    <div className="flex h-2/6 items-center justify-center overflow-x-hidden border-t border-zinc-600 bg-zinc-800">
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
                <div className="row-start-4 mt-auto mb-12 grid grid-cols-[80%_20%] border bg-black py-0.5 transition-all">
                    <div className="flex flex-col divide-y-2 uppercase *:py-0.5">
                        {statTypes.map((stat) => {
                            const skipItems = new Set(['magsize', 'price']);
                            if (skipItems.has(stat)) return;
                            return (
                                <div key={stat} className="mr-3 grid grid-cols-[20%_20%_47%] justify-end gap-4 *:my-auto">
                                    <span
                                        className={`${contextDependentStatModifier(stat) > 0 ? 'text-lime-400' : contextDependentStatModifier(stat) < 0 ? 'text-red-500' : ''} place-items-center place-self-end text-xs font-extrabold transition-all duration-250`}
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
                        <div className="my-1 grid w-3/4 grid-cols-1 gap-2 font-extrabold">
                            <div>
                                <div className="text-xs">Mags</div>
                                <div className="-mt-1 text-3xl">{weapon.extra_mags}</div>
                            </div>
                            <div
                                className={`${weapon.magsize + contextDependentStatModifier('magsize') > weapon.magsize ? 'text-lime-400' : weapon.magsize + contextDependentStatModifier('magsize') < weapon.magsize ? 'text-red-500' : ''} transition-all`}
                            >
                                <div className="text-xs">Mag Size</div>
                                <div className="flex">
                                    <div className="-mt-1 text-3xl">{weapon.magsize}</div>
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
                {/* Attachment Selection */}
                <div>
                    {Object.entries(snap.grouped).map(([area, attachments]) => {
                        if (area === 'other' || area === 'all') return;
                        return (
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
                        );
                    })}
                </div>
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

            <div
                style={{
                    backgroundColor:
                        snap.currentAreaSelection === 'other' || state.currentAreaSelection === 'all' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.3)',
                }}
                className="pointer-events-none absolute top-0 right-0 z-100 h-full w-full transition-all duration-400"
            >
                {/* Attachment Selection List */}
                <div
                    className={`${isPlaying ? '' : 'opacity-0'} pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-orange-600/10 transition-opacity duration-300`}
                />
                <div className="pointer-events-auto absolute top-4 left-4 font-extrabold">
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
    );
}

function goBackTo3D(area: Area): void {
    playLower('/sounds/switchto_selection_all.mp3');
    state.currentAreaSelection = area;
}

function handleClickAttachmentArea(snap: any, area: Area) {
    if (snap.currentAreaSelection === 'all' || state.currentAreaSelection === 'other') {
        playLower('/sounds/switchto_attachments.mp3');
    } else if (snap.currentAreaSelection !== area) {
        playLower('/sounds/switch_attachment_area.mp3');
    }
    state.currentAreaSelection = area;
}
