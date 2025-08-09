import { CameraControls, ContactShadows, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing';
import React, { memo, Suspense, useEffect, useState } from 'react';
import { Area } from './Customizer';

type Props = { cameraControlsRef: React.RefObject<CameraControls | null>; weaponId: number; setCurrentAreaSelection: React.Dispatch<Area> };
const weaponModules = import.meta.glob('../ModelDefinitions/*.tsx');

function CustomizerScene({ cameraControlsRef, weaponId, setCurrentAreaSelection }: Props) {
    const [WeaponModel, setWeaponModel] = useState<React.ComponentType<any> | null>(null);
    useEffect(() => {
        if (!weaponId) return;

        const path = `../ModelDefinitions/${weaponId}.tsx`;
        const loader: () => Promise<any> = weaponModules[path];

        if (loader) {
            loader()
                .then((model) => {
                    setWeaponModel(() => model.default || model[weaponId]);
                })
                .catch(() => setWeaponModel(null));
        } else {
            setWeaponModel(null);
        }
    }, [weaponId]);
    return (
        <>
            <div style={{ width: '1920px', height: '1080px', margin: 'auto', backgroundColor: '#151515' }}>
                <Canvas shadows>
                    <Suspense fallback={null}>
                        <Stage environment="studio" intensity={0.2} castShadow={true} shadows preset="upfront">
                            {WeaponModel && <WeaponModel />}
                        </Stage>
                        <ContactShadows position={[0, -5, 0]} opacity={0.7} width={40} height={40} blur={2} far={5} color="#000000" />

                        <CameraControls
                            ref={cameraControlsRef}
                            minDistance={0.2}
                            maxDistance={5}
                            minPolarAngle={Math.PI / 6}
                            maxPolarAngle={Math.PI / 1.8}
                            onControlEnd={() => setCurrentAreaSelection('other')}
                        />
                        <EffectComposer>
                            <SMAA />
                            <Bloom intensity={0.2} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
                            <ChromaticAberration offset={[0.0002, 0.0002]} />
                            <Vignette darkness={0.4} offset={0.3} />
                        </EffectComposer>
                    </Suspense>
                </Canvas>
            </div>
        </>
    );
}

export default memo(CustomizerScene);
