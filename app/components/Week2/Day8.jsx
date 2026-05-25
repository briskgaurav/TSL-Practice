"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { color, sin, step, time, uv } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";

export default function Day8() {
    const stepValue = 0.95
  const material = new MeshBasicNodeMaterial();
  const tilesUv = uv().mul(5).fract();
  const lineX = step(stepValue, tilesUv.x);
  const LineBottom = step(stepValue, tilesUv.y.oneMinus());
  const lineLeft = step(stepValue, tilesUv.x.oneMinus());
  const lineY = step(stepValue, tilesUv.y);
  const grid = lineX.add(lineY).add(lineLeft).add(LineBottom);
  material.colorNode = color(grid);

  return (
    <Canvas
      gl={async (props) => {
        const renderer = new WebGPURenderer(props);
        await renderer.init();
        return renderer;
      }}
    >
      <mesh material={material}>
        <planeGeometry args={[2, 2, 10, 10]} />
      </mesh>
      {/* <OrbitControls /> */}
    </Canvas>
  );
}
