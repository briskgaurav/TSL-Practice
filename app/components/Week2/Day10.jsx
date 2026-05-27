"use client";
import { Canvas } from "@react-three/fiber";
import { color, sin,  time, uv } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";

export default function Day10() {
    const material = new MeshBasicNodeMaterial();
    const wave = sin(uv().y.mul(100).add(time.mul(10)))
    material.colorNode = color(wave)

    return (
        <Canvas
            gl={async (props) => {
                const renderer = new WebGPURenderer(props);
                await renderer.init();
                return renderer;
            }}
        >
            <mesh material={material}>
                <planeGeometry args={[3, 3, 100]} />
            </mesh>
            {/* <OrbitControls /> */}
        </Canvas>
    );
}
