import { Canvas, useThree } from "@react-three/fiber";
import { color, distance, sin, smoothstep, time, uv, vec2 } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";

function BlinkingProceduralOrbsTile() {
  const { viewport } = useThree();
  const aspect = viewport.width / viewport.height;
  const material = new MeshBasicNodeMaterial();
  // FRACT() function normalize the decimal value means 2.5 becomes .5 , and 1.2 becomes .2 and .5 becomes .5 also using aspect ratio in x to fix scaling ovals
  const centeredUvTiles = vec2(uv().x.mul(aspect),uv().y).mul(5).fract().sub(.5)
  const d = distance(centeredUvTiles, vec2(0));
  const pulse = sin(time.mul(2)).mul(0.1);
  // BOTH PULSE IS USED BEVAUSE THE RANGE OF SMOOTHSTEP IS UNSTABLE AND THIS MAKE COLOR INVERSION
  const glow = smoothstep(pulse.add(0.4), pulse.add(0.0), d);
  material.colorNode = color(glow, 0, glow);
  material.transparent = true;
  material.opacityNode = glow;

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <primitive object={material} />
    </mesh>
  );
}

export default function MiniProject1() {
  return (
    <Canvas
      gl={async (props) => {
        const renderer = new WebGPURenderer(props);
        await renderer.init();
        return renderer;
      }}
    >
      <BlinkingProceduralOrbsTile />
    </Canvas>
  );
}
