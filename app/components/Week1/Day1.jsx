'use client'
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { color, sin, time } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";


export default function Day1() {
    const material = new MeshBasicNodeMaterial()
    // to multiple with time (time.mul(100))
    // NORMALIZE SIN WAVES sin(value).mul(.5).add(.5)
    const pulse = sin(time.mul(18)).mul(.5).add(.5)
    material.colorNode = color(pulse,0.2,0.6)

    return (
        <div className="h-screen w-full bg-black flex justify-center items-center">
            <Canvas gl={async (props) => {
                const renderer = new WebGPURenderer(props)
                await renderer.init()
                return renderer
            }}>
                <mesh material={material}>

                    <boxGeometry args={[1.5, 1.5, 1.5, 100, 100, 100]} />
                </mesh>
                <OrbitControls />
            </Canvas>
        </div>
    )
}
