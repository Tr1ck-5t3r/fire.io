import { Engine, Scene, UniversalCamera, HemisphericLight, Vector3 } from 'babylonjs';
import { createGround } from '../world/ground';

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);

  // Camera
  const camera = new UniversalCamera('camera', new Vector3(0, 2, -5), scene);
  camera.attachControl(canvas, true);    // enable input (mouse + keyboard)
  camera.speed = 0.5;  

  // Expose the Babylon scene for UI components (Reticle) to consume
  try {
    ;(window as any).babylonScene = scene
  } catch (e) {
    // ignore
  }

  // Light
  new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Ground (moved to world module)
  createGround(scene)

  // Placeholder for player, objects, etc.

  return scene;
}
