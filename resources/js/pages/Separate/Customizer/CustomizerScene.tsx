import WeaponModel from '@/pages/Separate/Customizer/WeaponModel';
import { Weapon } from '@/types/types';
import { router } from '@inertiajs/react';
import { ContactShadows } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing';
import React, { memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    cameraControlsRef: React.RefObject<any>;
    weapon: Weapon;
}

function ScreenshotHelper({ onScreenshotReady }: { onScreenshotReady: (dataURL: string) => void }) {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
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

function CustomizerScene({ cameraControlsRef, weapon, attachmentModels, areaDisplays }: Props) {
    const canvasRef = useRef(null);
    const [, setScreenshotDataURL] = useState<string | null>(null);

    const handleScreenshot = useCallback(
        (dataURL: string) => {
            setScreenshotDataURL(dataURL);
            router.post('/addImage', {
                image: dataURL,
                weapon_id: weapon.id,
            });

            // Download logic
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `weapon-${weapon.id}-screenshot.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        [weapon],
    );

    return (
        <>
            <div style={{ width: '100%', height: '100%', margin: 'auto', backgroundColor: '#151517' }}>
                <Suspense
                    fallback={
                        <div className="flex h-full items-center justify-center">
                            <span className="loader" />
                        </div>
                    }
                >
                    <Canvas
                        ref={canvasRef}
                        shadows
                        style={{ top: 0, right: 0, position: 'absolute' }}
                        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
                    >
                        {/* Add the ScreenshotHelper component inside the Canvas */}
                        <ScreenshotHelper onScreenshotReady={handleScreenshot} />
                        {WeaponModel ? (
                            <WeaponModel
                                attachmentModels={attachmentModels}
                                areaDisplays={areaDisplays}
                                cameraControlsRef={cameraControlsRef}
                                weapon={weapon}
                            />
                        ) : null}
                        <ContactShadows position={[0, -5, 0]} opacity={0.7} width={40} height={40} blur={2} far={5} color="#000000" />
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
