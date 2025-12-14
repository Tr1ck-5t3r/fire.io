import { Engine, Scene, UniversalCamera, HemisphericLight, Vector3 } from 'babylonjs';
import { createGround } from '../world/ground';
import { createWallBoundary } from '../world/Walls';
import { createRoof } from '../world/Roof';

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);

  // Camera
  const camera = new UniversalCamera('camera', new Vector3(0, 2, -5), scene);
  camera.attachControl(canvas, true);    // enable input (mouse + keyboard)
  camera.angularSensibility = 10000;

  // Hide mouse cursor
  canvas.style.cursor = "none";

  // Lock pointer on click (FPS behavior)
  scene.onPointerDown = () => {
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  };

  // Add pointer lock change listener
  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === canvas) {
      canvas.style.cursor = "none";
    } else {
      canvas.style.cursor = "default";
    }
  });

  // Expose the Babylon scene for UI components (Reticle) to consume
  try {
    ;(window as any).babylonScene = scene
  } catch (e) {
    // ignore
  }

  // Light
  new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Ground (moved to world module)
  createGround(scene, 20, '/floor-texture.png', 1);
  // Create walls on 4 sides with images
  createWallBoundary(scene, '/wall-texture.jpg', 20, 10, 1);

  createRoof(scene, 20, 10, '/roof-texture.jpg');


  // Placeholder for player, objects, etc.

  return scene;
}
