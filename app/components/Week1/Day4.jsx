import { Canvas } from "@react-three/fiber";
import { color, mix, smoothstep, time, uv } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";

export default function Day4() {
    // CLAMP NORMALIZE THE VALUE, WHEN WE CHANGE UV or Increase uv size, so to normalize it we use clamp
    const materialWithClamp = new MeshBasicNodeMaterial()
    materialWithClamp.colorNode = color(uv().mul(5).clamp(0, 1), 0)


    // MIX used for mixing two colors, gradients , day-night transitions , interpolation etc , (a,b,t) : Where a is the first vale , b is second and t is the strength values~ is strength is .5 then a & b middle value comes
    const materialWithMix = new MeshBasicNodeMaterial()
    const gradient = mix(color(1, 0, 0), color(0, 0, 1), time.clamp(0, 1)) //With clamp it works from 0-1 and a smooth transition 
    materialWithMix.colorNode = gradient


    // SMOOTHSTEP
    const materialWithSmoothStep = new MeshBasicNodeMaterial()
    const gradientsmoothstep = smoothstep(
        0.4,
        1,
        uv().x
    )
    materialWithSmoothStep.colorNode = color(gradientsmoothstep)



    return (
        <Canvas gl={async (props) => {
            const renderer = new WebGPURenderer(props)
            await renderer.init()
            return renderer
        }}>
            <mesh >
                <planeGeometry args={[3, 3, 10, 10]} />
                <primitive object={materialWithSmoothStep} />
            </mesh>
        </Canvas>
    )
} 