import { Canvas } from "@react-three/fiber";
import { color, sin, time, uv } from "three/tsl";
import { MeshBasicNodeMaterial, PlaneGeometry, WebGPURenderer } from "three/webgpu";

export default function Day2() {

    const material = new MeshBasicNodeMaterial()
    // BLUR TO PINK
    // material.colorNode = color(uv().x,0,1)

    // CORNERS = YELLO , BLACK , RED , GREEN
    material.colorNode = color(uv().x,uv().y,sin(time))


    // color(1,2,3)
    return (
        <Canvas gl={async (props) => {
            const renderer = new WebGPURenderer(props)
            renderer.init()
            return renderer
        }}>
            <mesh >
                <planeGeometry args={[5, 5, 10, 10]} />
                <primitive object={material} />
            </mesh>

        </Canvas>
    )
}
