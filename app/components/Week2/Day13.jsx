import { Canvas } from "@react-three/fiber";
import { color, sin, step, time, uv } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";

export default function Day13() {
    const material = new MeshBasicNodeMaterial()
    const mask = step(.5, uv().y) //STEP FUNCTION IS FOR MASK HARSH , WE CAN USE SMOOTHSTEP ALSO FOR SMOOTH MASK
    const wave = sin(uv().x.mul(20).add(time))
    const distoredWave = sin(uv().y.mul(15).add(wave)).mul(.5).add(.5)
    const maskedWave = distoredWave.mul(mask) //TO MASK WE USE MUL (and step funtion)
    material.colorNode = color(maskedWave,0.2,0.2)
    return (
        <Canvas gl={async (props) => {
            const renderer = new WebGPURenderer(props)
            await renderer.init()
            return renderer
        }}>
            <mesh material={material}>
                <planeGeometry args={[3, 3, 100]} />
            </mesh>

        </Canvas>
    )
}
