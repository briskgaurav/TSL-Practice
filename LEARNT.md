# Day 1 Learnings

- **Time Multiplication**: Speed up the pulse by multiplying the time node:
  ```javascript
  time.mul(100)
  ```

- **Normalizing Sine Waves**: Convert the standard sine wave output from `[-1, 1]` to a positive color-safe range of `[0, 1]` using:
  ```javascript
  sin(value).mul(.5).add(.5)
  ```

- **Node Materials**: Used modern NodeMaterials (`MeshBasicNodeMaterial`) from `three/webgpu` to program shader logic directly inside JavaScript using TSL nodes (like `colorNode`).
