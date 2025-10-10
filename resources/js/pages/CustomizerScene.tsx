import { CameraControls, ContactShadows, Stage } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing';
import React, { lazy, memo, Suspense, useCallback, useMemo, useRef } from 'react';
import { Area } from './Customizer';

const weaponModules = import.meta.glob('../ModelDefinitions/*.tsx');

interface Props {
    cameraControlsRef: React.RefObject<any>;
    weaponId: number | null;
    setCurrentAreaSelection: (area: Area) => void;
}

function ScreenshotHelper({ onScreenshotReady }: { onScreenshotReady: (dataURL: string) => void }) {
    const { gl, scene, camera } = useThree();

    React.useEffect(() => {
        window.takeScreenshot = () => {
            gl.render(scene, camera);
            const dataURL = gl.domElement.toDataURL('image/png');
            onScreenshotReady(dataURL);
        };

        return () => {
            window.takeScreenshot = undefined;
        };
    }, [gl, scene, camera, onScreenshotReady]);

    return null;
}

function CustomizerScene({ cameraControlsRef, weaponId, setCurrentAreaSelection }: Props) {
    const canvasRef = useRef(null);
    const [screenshotDataURL, setScreenshotDataURL] = React.useState<string | null>(null);

    const handleScreenshot = useCallback(
        (dataURL: string) => {
            setScreenshotDataURL(dataURL);

            // Download logic
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `weapon-${weaponId}-screenshot.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        [weaponId],
    );

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
                    <button
                        onClick={() => {
                            if (window.takeScreenshot) {
                                cameraControlsRef.current.setLookAt(0, 0, 5, 0, 0, 0, false);
                                const take = window.takeScreenshot;
                                setTimeout(() => {
                                    take?.();
                                }, 100);
                            }
                        }}
                    >
                        Take screenshot
                    </button>
                    <Canvas ref={canvasRef} shadows gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}>
                        {/* Add the ScreenshotHelper component inside the Canvas */}
                        <ScreenshotHelper onScreenshotReady={handleScreenshot} />

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

declare global {
    interface Window {
        takeScreenshot?: () => void;
    }
}

export default memo(CustomizerScene);
