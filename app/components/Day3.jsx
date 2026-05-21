import { Canvas } from "@react-three/fiber";
import { color, sin, time, uv } from "three/tsl";
import { MeshBasicNodeMaterial, PlaneGeometry, WebGPURenderer } from "three/webgpu";

export default function Day2() {

  const material = new MeshBasicNodeMaterial()
  material.colorNode = color(
    uv().sub(.5),
    0
  )



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
