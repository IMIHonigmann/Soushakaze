import { CameraControls } from '@react-three/drei';
import { useCallback, useMemo, useRef, useState } from 'react';
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
    attachments: Attachment[];
}

export default function Customizer({ weaponName, attachments }: Props) {
    const cameraControlsRef = useRef<CameraControls>(null);
    const grouped = attachments.reduce<Record<string, Attachment[]>>((acc, att) => {
        acc[att.area] = acc[att.area] || [];
        acc[att.area].push(att);
        return acc;
    }, {});

    const [currentAreaSelection, setCurrentAreaSelection] = useState<Area>('all');
    const [selected, setSelected] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        Object.entries(grouped).forEach(([area, attachments]) => {
            // Default to first attachment's id in each area
            initial[area] = attachments[0]?.id ?? 0;
        });
        return initial;
    });

    const handleSelect = (area: Area, id: number) => {
        setSelected((prev) => ({
            ...prev,
            [area]: id,
        }));
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

    useMemo(() => {
        let cameraTransform: [target: THREE.Vector3, position: THREE.Vector3] | undefined;
        switch (currentAreaSelection) {
            case 'stock':
                cameraTransform = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-5, 0, 3)];
                break;
            case 'magazine':
                cameraTransform = [new THREE.Vector3(1.5, -0.75, 0), new THREE.Vector3(0, -1, 3)];
                break;
            case 'all':
                cameraTransform = [new THREE.Vector3(0, -0.35, 0), new THREE.Vector3(0, 0, 5)];
                break;
            default:
                cameraTransform = undefined;
        }

        if (cameraTransform) {
            setCameraControls(cameraTransform[0], cameraTransform[1]);
        }
    }, [currentAreaSelection, setCameraControls]);

    return (
        <>
            <MdOutlineCameraswitch
                className={`scale absolute top-4 left-4 z-10 cursor-pointer text-7xl transition-transform duration-300 ${currentAreaSelection === 'all' ? '-translate-x-20 scale-50' : 'translate-x-0 hover:scale-125 hover:rotate-360 hover:ease-out'}`}
                onClick={() => setCurrentAreaSelection('all')}
            />
            <CustomizerScene cameraControlsRef={cameraControlsRef}></CustomizerScene>
            <div className="text-5xl">{weaponName}</div>
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
            </div>
        </>
    );
}
