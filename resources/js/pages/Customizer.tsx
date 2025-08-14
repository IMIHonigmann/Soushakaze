import { useCustomizerStore } from '@/stores/useCustomizerStore';
import { Link } from '@inertiajs/react';
import { CameraControls } from '@react-three/drei';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MdOutlineCameraswitch } from 'react-icons/md';
import * as THREE from 'three';
import CustomizerScene from './CustomizerScene';

export type Attachment = {
    id: number;
    name: string;
    area: string;
};

export type Area = 'muzzle' | 'scope' | 'magazine' | 'grip' | 'stock' | 'barrel' | 'laser' | 'flashlight' | 'bipod' | 'underbarrel' | 'other' | 'all';

interface Props {
    weaponName: string;
    weaponId: number;
    attachments: Attachment[];
}

export default function Customizer({ weaponName, weaponId, attachments }: Props) {
    const cameraControlsRef = useRef<CameraControls>(null);
    const grouped = attachments.reduce<Record<string, Attachment[]>>((acc, att) => {
        acc[att.area] = acc[att.area] || [];
        acc[att.area].push(att);
        return acc;
    }, {});

    const { selected, currentAreaSelection, setSelected, setCurrentAreaSelection, initializeSelections } = useCustomizerStore();

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

    function addToCart(): void {
        const localCartString = localStorage.getItem('cart');
        const cartArray = localCartString ? JSON.parse(localCartString) : [];
        cartArray.push({ weaponId, weaponName, selectedAttachments: { ...selected } });
        localStorage.setItem('cart', JSON.stringify(cartArray));
    }

    return (
        <>
            <MdOutlineCameraswitch
                className={`scale absolute top-4 left-4 z-10 cursor-pointer text-7xl transition-transform duration-300 ${currentAreaSelection === 'all' ? '-translate-x-20 scale-50' : 'translate-x-0 hover:scale-125 hover:rotate-360 hover:ease-out'}`}
                onClick={() => setCurrentAreaSelection('all')}
            />
            <CustomizerScene
                weaponId={weaponId}
                setCurrentAreaSelection={setCurrentAreaSelection}
                cameraControlsRef={cameraControlsRef}
            ></CustomizerScene>
            <div className="flex justify-center">
                <div className="absolute bottom-10 flex justify-center gap-8">
                    {Object.entries(grouped).map(([area, attachments]) => (
                        <div key={area}>
                            <strong className="select-none">{area.charAt(0).toUpperCase() + area.slice(1)}</strong>
                            <ul>
                                <li
                                    key={`standard-${area}`}
                                    style={{
                                        fontWeight: selected[area] === 0 ? 'bold' : 'normal',
                                        background: selected[area] === 0 ? '#FF0000' : 'transparent',
                                    }}
                                    onClick={() => handleSelect(area as Area, 0)}
                                    className="cursor-pointer select-none"
                                >
                                    Factory issue
                                </li>
                                {(attachments as Attachment[]).map((a) => (
                                    <li
                                        key={a.id}
                                        style={{
                                            fontWeight: selected[area] === a.id ? 'bold' : 'normal',
                                            background: selected[area] === a.id ? '#FF0000' : 'transparent',
                                        }}
                                        onClick={() => handleSelect(area as Area, a.id)}
                                        className="cursor-pointer select-none"
                                    >
                                        {a.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <Link className="cursor-pointer" onClick={() => addToCart()} href={route('cart')}>
                    ADD TO CART
                </Link>
            </div>
        </>
    );
}
