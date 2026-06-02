"use client";
import { Canvas } from "@react-three/fiber";
import { color, sin, time, uv } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";



export default function Day12() {

    const FREQUENCY = 5
    const WAVE_AMPLITUDE = 2
    const TIME_MULTIPLIER = 2
    const material = new MeshBasicNodeMaterial();
    material.colorNode = color(sin(uv().y.mul(FREQUENCY).add(sin(uv().x.mul(WAVE_AMPLITUDE).add(time).mul(TIME_MULTIPLIER)))).add(.5).mul(.5), 0, 0)

    return (
        <>
        <h1 className="absolute top-[4vw] left-1/2 -translate-x-1/2 text-center text-red-700 w-full  z-999 text-[10vw] font-bold font-sans">SHADER WAVE</h1>
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
