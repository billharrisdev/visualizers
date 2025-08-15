declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import * as THREE from 'three';
  export class EffectComposer {
    constructor(renderer: THREE.WebGLRenderer);
    render(): void;
    setSize(width: number, height: number): void;
  addPass(pass: unknown): void;
  passes: unknown[];
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import * as THREE from 'three';
  export class RenderPass {
    constructor(scene: THREE.Scene, camera: THREE.Camera);
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import * as THREE from 'three';
  export class UnrealBloomPass extends THREE.Vector2 {
    constructor(resolution: THREE.Vector2, strength?: number, radius?: number, threshold?: number);
    strength: number;
    radius: number;
    threshold: number;
    setSize(width: number, height: number): void;
  }
}
