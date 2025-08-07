import { MP5 } from '@/ModelDefinitions/MP5';
import { CameraControls, ContactShadows, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing';
import { memo, Suspense, useRef } from 'react';
import * as THREE from 'three';

function CustomizerScene() {
    const cameraControls = useRef<CameraControls>(null);

    function setCameraControls(target: THREE.Vector3, pos: THREE.Vector3) {
        if (!cameraControls.current) return;

        cameraControls.current.setTarget(target.x, target.y, target.z, true);
        cameraControls.current.setPosition(pos.x, pos.y, pos.z, true);
    }

    return (
        <>
            <button className="cursor-pointer" onClick={() => setCameraControls(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-5, 0, 3))}>
                Stock
            </button>
            <br />
            <button className="cursor-pointer" onClick={() => setCameraControls(new THREE.Vector3(0, -0.35, 0), new THREE.Vector3(0, 0, 5))}>
                Main
            </button>
            <br />
            <button className="cursor-pointer" onClick={() => setCameraControls(new THREE.Vector3(1.5, -0.75, 0), new THREE.Vector3(0, -1, 3))}>
                Mag
            </button>
            <div style={{ width: '1920px', height: '1080px', margin: 'auto', backgroundColor: '#151515' }}>
                <Canvas shadows camera={{ position: [0, 0, 20], fov: 50 }}>
                    <Suspense fallback={null}>
                        <Stage environment="studio" intensity={0.2} castShadow={true} shadows preset="upfront">
                            <MP5 scale={10} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
                        </Stage>

                        <ContactShadows position={[0, -5, 0]} opacity={0.7} width={40} height={40} blur={2} far={5} color="#000000" />

                        <CameraControls
                            ref={cameraControls}
                            minDistance={0.2}
                            maxDistance={5}
                            minPolarAngle={Math.PI / 4}
                            maxPolarAngle={Math.PI / 1.8}
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
