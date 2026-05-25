"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import { color, distance, mix, smoothstep, uv, vec3 } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";
import { RoundedPlaneGeometry } from "maath/geometry";
extend({ RoundedPlaneGeometry });

export default function Day9() {
  const material = new MeshBasicNodeMaterial();
  const centerUv = uv().sub(0.5);
  const d = (distance(centerUv, 0));
  const outerCircle = smoothstep(0.3, 0.29, d);
  const innerCircle = smoothstep(0.25, 0.24, d);
  const centerDot = smoothstep(0.05, 0.04, d);
  const bullsEye = outerCircle.sub(innerCircle).add(centerDot)
  const backgroundPlaneColor = color(10, 10, 10);
  const ringColor = color(1, 0, 0);
  material.colorNode = mix(backgroundPlaneColor, ringColor, bullsEye);

  return (
    <Canvas
      gl={async (props) => {
        const renderer = new WebGPURenderer(props);
        await renderer.init();
        return renderer;
      }}
    >
      <mesh material={material}>
        <roundedPlaneGeometry  args={[3, 3, 0.4]} />
      </mesh>
      {/* <OrbitControls /> */}
    </Canvas>
  );
}
