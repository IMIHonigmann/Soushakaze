import { MP5 } from '@/ModelDefinitions/MP5';
import { ContactShadows, OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing';
import { Suspense } from 'react';

export default function CustomizerScene() {
    return (
        <>
            <div style={{ width: '1920px', height: '1080px', margin: 'auto', backgroundColor: '#151515' }}>
                <Canvas shadows camera={{ position: [0, 0, 20], fov: 50 }}>
                    <Suspense fallback={null}>
                        <Stage environment="studio" intensity={0.2} castShadow={true} shadows preset="upfront">
                            <MP5 scale={10} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
                        </Stage>

                        <ContactShadows position={[0, -5, 0]} opacity={0.7} width={40} height={40} blur={2} far={5} color="#000000" />

                        <OrbitControls minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} enableZoom={true} enablePan={false} />
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
