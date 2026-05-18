# 🚀 Day 1: Hello WebGPU & Three Shading Language (TSL)

Today, you took your first step into the future of web-based 3D graphics by building a procedural shader using Three.js's new **WebGPU Node-based Shading System** (Three Shading Language, or **TSL**).

Here is a comprehensive breakdown of what you learned and implemented today.

---

## 🧠 Key Concepts & Learnings

### 1. The WebGPU Shift (`WebGPURenderer`)
Three.js is transitioning from WebGL to **WebGPU**, which provides lower-overhead access to modern GPU capabilities (Vulkan, Metal, and Direct3D 12).
* **Asynchronous Initialization**: Unlike the traditional synchronous `WebGLRenderer`, the `WebGPURenderer` requires an explicit asynchronous initialization step before rendering.
* **React Three Fiber (R3F) Integration**: 
  To use WebGPU inside `<Canvas>`, you passed a custom `gl` initialization function:
  ```jsx
  <Canvas gl={async (props) => {
      const renderer = new WebGPURenderer(props)
      await renderer.init()
      return renderer
  }}>
  ```

### 2. Node Materials & Three Shading Language (TSL)
Traditionally, writing custom shaders required writing raw GLSL (OpenGL Shading Language) or WGSL strings.
* **TSL** lets you build shaders programmatically in JavaScript/TypeScript.
* **`MeshBasicNodeMaterial`**: A WebGPU-native material that supports procedural input nodes.
* **`colorNode`**: Instead of assigning a static color value, you assigned a dynamic shader graph to `material.colorNode`, telling the GPU how to calculate the pixel colors at runtime.

### 3. Procedural Shader Math & Normalization
You used dynamic TSL math functions imported from `'three/tsl'`:
```javascript
const pulse = sin(time.mul(18)).mul(.5).add(.5)
```

Here's the math behind that pulsing animation:
1. **`time`**: A dynamic built-in node representing the elapsed seconds.
2. **`time.mul(18)`**: Multiplies time by 18 to speed up the oscillation (time compression).
3. **`sin(...)`**: Computes the sine wave. A standard sine wave oscillates between **`[-1.0, 1.0]`**.
4. **`mul(.5)` (Scale)**: Shrinks the amplitude to oscillate between **`[-0.5, 0.5]`**.
5. **`add(.5)` (Offset/Bias)**: Shifts the values upward to oscillate between **`[0.0, 1.0]`**.

#### Why Normalization Matters 📊
Color channels in shaders must be between `0.0` (completely off) and `1.0` (fully saturated). Passing negative values is invalid/clipped. Normalizing the sine wave keeps the pulse perfectly within the visible `[0.0, 1.0]` range.

| Step | Math Operation | Range | Visual Effect |
| :--- | :--- | :--- | :--- |
| **1. Input** | $t$ | $[0, \infty)$ | Raw Elapsed Time |
| **2. Frequency** | $18 \times t$ | $[0, \infty)$ | Speeds up the cycle rate |
| **3. Wave** | $\sin(18 \times t)$ | $[-1.0, 1.0]$ | Standard oscillating curve |
| **4. Scale** | $0.5 \times \sin(18 \times t)$ | $[-0.5, 0.5]$ | Fits half the color bounds |
| **5. Bias** | $(0.5 \times \sin(18 \times t)) + 0.5$ | $[0.0, 1.0]$ | **Perfect color pulse range** |

### 4. Dynamic Color Mixing
```javascript
material.colorNode = color(pulse, 0.2, 0.6)
```
You passed the dynamic `pulse` into the **Red** channel of a 3-component `color` (RGB) node, while locking **Green** at `0.2` and **Blue** at `0.6`.
* When `pulse = 0.0` (minimum): Color is `color(0, 0.2, 0.6)` ➔ **Deep Elegant Teal/Blue-Green**
* When `pulse = 1.0` (maximum): Color is `color(1, 0.2, 0.6)` ➔ **Vibrant Purple-Magenta**
* **Result**: The cube beautifully and seamlessly transitions back and forth between these two modern, premium hues.

---

## 🛠️ Code Reference (`app/components/Day1.jsx`)

Here is your annotated implementation:

```javascript
'use client'
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { color, sin, time } from "three/tsl";
import { MeshBasicNodeMaterial, WebGPURenderer } from "three/webgpu";

export default function Day1() {
    // 1. Create a modern node-based material
    const material = new MeshBasicNodeMaterial()
    
    // 2. Compute a normalized sine pulse (oscillates between 0 and 1)
    const pulse = sin(time.mul(18)).mul(.5).add(.5)
    
    // 3. Drive the colorNode procedurally with the pulse on the Red channel
    material.colorNode = color(pulse, 0.2, 0.6)

    return (
        <div className="h-screen w-full bg-black flex justify-center items-center">
            {/* 4. Asynchronously initialize the new WebGPURenderer */}
            <Canvas gl={async (props) => {
                const renderer = new WebGPURenderer(props)
                await renderer.init()
                return renderer
            }}>
                <mesh material={material}>
                    {/* 5. A cube geometry with high vertex counts for smooth shading */}
                    <boxGeometry args={[1.5, 1.5, 1.5, 100, 100, 100]} />
                </mesh>
                <OrbitControls />
            </Canvas>
        </div>
    )
}
```

---

## 🔮 Looking Ahead: Ideas for Day 2
* **Vertex Displacement (`positionNode`)**: Try deforming the geometry's vertices using TSL! By modifying the `positionNode`, you can make the cube wave like a flag or morph into a sphere.
* **Organic Noise (`noise`)**: Go beyond basic sine waves and explore procedural simplex or cellular noise nodes in TSL to create fluid, marble-like patterns.
* **Material Depth (`MeshStandardNodeMaterial`)**: Migrate to a standard material and play with `roughnessNode`, `metalnessNode`, and how they dynamically react to lights.
