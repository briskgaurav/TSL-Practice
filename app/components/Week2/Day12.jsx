"use client";
import { Canvas } from "@react-three/fiber";
import { mix, sin, time, uv, vec3 } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";



export default function Day12() {

    const FREQUENCY = 5
    const WAVE_AMPLITUDE = 2
    const WAVE2_AMPLITUDE = 4
    const TIME_MULTIPLIER = 2
    const material = new MeshBasicNodeMaterial();
    const wave1 = sin(uv().x.mul(WAVE_AMPLITUDE).add(time).mul(TIME_MULTIPLIER))
    const wave2 = sin(uv().x.mul(WAVE2_AMPLITUDE).add(time).mul(TIME_MULTIPLIER))
    const wave = wave1.add(wave2)
    const finalShader = sin(uv().y.mul(FREQUENCY).add(wave)).mul(.5).add(.2)
    material.colorNode = mix( vec3(0, 0, 0),vec3(1, 0, 1), finalShader)

    return (
        <>
            <h1 className="absolute top-[4vw] select-none left-1/2 -translate-x-1/2 text-center text-[#D500CB] w-full  z-999 text-[10vw] font-bold font-sans">SHADER WAVE</h1>
            <Canvas
                gl={async (props) => {
                    const renderer = new WebGPURenderer(props);
                    await renderer.init();
                    return renderer;
                }}
            >
                <mesh material={material}>
                    <planeGeometry args={[15, 8, 100]} />
                </mesh>
                {/* <OrbitControls /> */}
            </Canvas>
        </>

    );
}
