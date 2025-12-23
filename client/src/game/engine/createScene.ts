import { Engine, Scene, UniversalCamera, HemisphericLight, Vector3 } from 'babylonjs';
import { createGround } from '../world/ground';
import { Snowman } from '../entities/Snowman';
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
    ;(window as any).babylonScene = scene;
    (window as any).camera = camera;
  } catch (e) {
    // ignore
  }

  // Light
  new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Ground (moved to world module)
  const snowman = new Snowman(scene, new Vector3(0, 0, 0), camera);

  // Attach camera controls after snowman is created
  // camera.attachControl(canvas, true);    // disable built-in mouse input
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput"); // Remove keyboard input

  // Configure mouse input for immediate control
  // const mouseInput = camera.inputs.attached.mouse;
  // if (mouseInput) {
  //   mouseInput.buttons = [0, 1, 2]; // Left, middle, right mouse buttons
  //   mouseInput.wheelPrecisionX = 3.0;
  //   mouseInput.wheelPrecisionY = 3.0;
  //   mouseInput.wheelPrecisionZ = 3.0;
  // }

  // Expose snowman for controller
  try {
    ;(window as any).snowman = snowman
  } catch (e) {
    // ignore
  }
  createGround(scene, 20, '/floor-texture.png', 1);
  // Create walls on 4 sides with images
  createWallBoundary(scene, '/wall-texture.jpg', 20, 10, 1);

  createRoof(scene, 20, 10, '/roof-texture.jpg');


  // Placeholder for player, objects, etc.

  return scene;
}
