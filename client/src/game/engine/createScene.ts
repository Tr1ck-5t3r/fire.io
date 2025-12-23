import { Engine, Scene, UniversalCamera, HemisphericLight, Vector3 } from 'babylonjs';
import { createGround } from '../world/ground';
import { Snowman } from '../entities/Snowman';
import { createWallBoundary } from '../world/Walls';
import { createRoof } from '../world/Roof';
import { getWorldConfig } from '../config/worldConfig';
import { createObstructions } from '../world/Obstructions';

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);

  // Load world configuration early
  const worldConfig = getWorldConfig();

  // Enable global collisions and simple gravity
  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -0.9, 0);

  // Camera (movement/collisions are handled by the snowman root mesh)
  const camera = new UniversalCamera('camera', new Vector3(0, 2, -5), scene);
  camera.attachControl(canvas, true);    // enable input (mouse + keyboard)
  camera.angularSensibility = worldConfig.controls.cameraAngularSensibility;

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

  // Ground (moved to world module) and player
  const snowman = new Snowman(scene, new Vector3(0, 0, 0), camera);
  const snowmanMesh = snowman.getMesh();

  // Attach camera controls after snowman is created
  // camera.attachControl(canvas, true);    // disable built-in mouse input
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput"); // Remove keyboard input

  // Configure mouse input for immediate control
   const mouseInput = camera.inputs.attached.mouse as any;
   if (mouseInput) {
     mouseInput.buttons = [0, 1, 2];  //Left, middle, right mouse buttons
     mouseInput.wheelPrecisionX = 3.0;
     mouseInput.wheelPrecisionY = 3.0;
     mouseInput.wheelPrecisionZ = 3.0;
   }

  // Expose snowman for controller
  try {
    ;(window as any).snowman = snowman
  } catch (e) {
    // ignore
  }

  // Create world geometry using config
  createGround(
    scene,
    worldConfig.arena.width,
    worldConfig.arena.depth,
    worldConfig.textures.ground,
    worldConfig.tiling.ground
  );
  // Create walls on 4 sides with images
  createWallBoundary(
    scene,
    worldConfig.textures.walls,
    worldConfig.arena.width,
    worldConfig.arena.depth,
    worldConfig.walls.height,
    worldConfig.tiling.walls,
    worldConfig.walls.thickness
  );

  createRoof(
    scene,
    worldConfig.arena.width,
    worldConfig.arena.depth,
    worldConfig.walls.height,
    worldConfig.textures.roof
  );

  // Create obstructions and miniwalls if enabled
  if (worldConfig.obstructions.enabled) {
    const obstructionMeshes = createObstructions(
      scene,
      worldConfig.obstructions.configs.map((config) => ({
        position: new Vector3(config.position[0], 0, config.position[1]),
        width: config.width,
        height: config.height,
        depth: config.depth,
        texturePath: config.texturePath || worldConfig.textures.walls, // Use wall texture by default
      }))
    );
  }

  // Enforce a movement boundary that matches the arena size,
  // but keep the player away from the walls according to config
  const arenaHalfWidth = worldConfig.arena.halfWidth;
  const arenaHalfDepth = worldConfig.arena.halfDepth;
  const margin = worldConfig.boundary.margin;

  scene.onBeforeRenderObservable.add(() => {
    const p = snowmanMesh.position;

    const limitX = arenaHalfWidth - margin;
    const limitZ = arenaHalfDepth - margin;
    p.x = Math.max(-limitX, Math.min(limitX, p.x));
    p.z = Math.max(-limitZ, Math.min(limitZ, p.z));

    // Keep feet on the ground
    if (p.y < 0) p.y = 0;
  });


  // Placeholder for player, objects, etc.

  return scene;
}
