"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { color, sin, time, uv, vec2, oneMinus } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";

function WaveScene() {
    // Get screen width/height and aspect ratio
    const { viewport } = useThree();
    const aspect = viewport.width / viewport.height;

    const material = new MeshBasicNodeMaterial();

    // Scale X by aspect ratio to prevent horizontal stretching
    const customUv = vec2(uv().x.mul(aspect), uv().y);

    // Create animated horizontal wave that distorts vertical coordinates
    const wave = customUv.y.add(sin(customUv.x.mul(2).add(time))).mul(.1);

    // Multiply frequency and map sine oscillations to [0, 1] range
    const lines = sin(wave.mul(10)).mul(.5).add(.5);

    // Invert stripe brightness and output as Red color
    material.colorNode = color(lines.y.oneMinus(), 0, 0);

    return (
        <mesh material={material}>
            <planeGeometry args={[viewport.width, viewport.height]} />
        </mesh>
    );
}

export default function Day11() {
    return (
        <Canvas
            gl={async (props) => {
                const renderer = new WebGPURenderer(props);
                await renderer.init();
                return renderer;
            }}
        >
            <WaveScene />
        </Canvas>
    );
}


