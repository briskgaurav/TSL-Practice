import { Canvas } from "@react-three/fiber";
import { color, distance, sin, smoothstep, time, uv, vec2 } from "three/tsl";
import { MeshBasicNodeMaterial, PlaneGeometry, WebGPURenderer } from "three/webgpu";

export default function Day5() {
    // TODAY WE WILL LEARN ABOUT DISTANCE() and Create a circle
    const material = new MeshBasicNodeMaterial()
    // Humko UvCenter krna h because my default center uv .5,.5 hota h
    const centerUV = uv().sub(.5)
    const calculateDistanceForEveryPixel = distance(centerUV, vec2(0))
    const circle = smoothstep(.3,.299,calculateDistanceForEveryPixel)
    material.colorNode = color(circle.x)


    return (
        <Canvas className="bg-zinc-500" gl={async (props) => {
            const renderer = new WebGPURenderer(props)
            await renderer.init()
            return renderer
        }}>
            <mesh >
                <planeGeometry args={[5, 5, 10, 10]} />
                <primitive object={material} />
            </mesh>

        </Canvas>
    )
}
