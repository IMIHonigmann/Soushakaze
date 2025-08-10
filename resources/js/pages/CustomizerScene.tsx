import { CameraControls, ContactShadows, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing';
import React, { lazy, memo, Suspense, useMemo } from 'react';
import { Area } from './Customizer';

type Props = { cameraControlsRef: React.RefObject<CameraControls | null>; weaponId: number; setCurrentAreaSelection: React.Dispatch<Area> };
const weaponModules = import.meta.glob('../ModelDefinitions/*.tsx');

function CustomizerScene({ cameraControlsRef, weaponId, setCurrentAreaSelection }: Props) {
    const WeaponModel = useMemo(() => {
        if (!weaponId) return null;

        return lazy(() => {
            const path = `../ModelDefinitions/${weaponId}.tsx`;
            const module: () => Promise<any> = weaponModules[path];

            if (!module) {
                return Promise.resolve({ default: () => null });
            }

            return module().then((model) => ({
                default: model.default || model[weaponId] || (() => null),
            }));
        });
    }, [weaponId]);
    return (
        <>
            <div style={{ width: '1920px', height: '960px', margin: 'auto', backgroundColor: '#151517' }}>
                <Suspense
                    fallback={
                        <div className="flex h-full items-center justify-center">
                            <span className="loader" />
                        </div>
                    }
                >
                    <Canvas shadows gl={{ alpha: true, antialias: true }}>
                        <Stage environment="studio" intensity={0.2} castShadow={true} shadows preset="upfront">
                            {WeaponModel ? <WeaponModel /> : null}
                        </Stage>
                        <ContactShadows position={[0, -5, 0]} opacity={0.7} width={40} height={40} blur={2} far={5} color="#000000" />

                        <CameraControls
                            ref={cameraControlsRef}
                            minDistance={2}
                            maxDistance={7}
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
                    </Canvas>
                </Suspense>
            </div>
        </>
    );
}

export default memo(CustomizerScene);
