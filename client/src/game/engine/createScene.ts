import {
  Engine,
  Scene,
  UniversalCamera,
  HemisphericLight,
  Vector3,
} from "babylonjs";

import { createGround } from "../world/ground";
import { Snowman } from "../entities/Snowman";
import { createWallBoundary } from "../world/Walls";
import { createRoof } from "../world/Roof";
import { getWorldConfig } from "../config/worldConfig";
import { createObstructions } from "../world/Obstructions";

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine);
  const worldConfig = getWorldConfig();

  scene.collisionsEnabled = true;
  scene.gravity = Vector3.Zero(); // ⛔ manual gravity only

  const camera = new UniversalCamera("camera", Vector3.Zero(), scene);
  camera.inputs.clear();
  camera.checkCollisions = false;
  camera.applyGravity = false;
  camera.minZ = 0.05;

  canvas.style.cursor = "none";

  scene.onPointerDown = () => {
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  };

  document.addEventListener("pointerlockchange", () => {
    canvas.style.cursor =
      document.pointerLockElement === canvas ? "none" : "default";
  });

  (window as any).camera = camera;

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  const snowman = new Snowman(scene, Vector3.Zero(), camera);
  (window as any).snowman = snowman;

  createGround(
    scene,
    worldConfig.arena.width,
    worldConfig.arena.depth,
    worldConfig.textures.ground,
    worldConfig.tiling.ground
  );

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

  if (worldConfig.obstructions.enabled) {
    createObstructions(
      scene,
      worldConfig.obstructions.configs.map((c) => ({
        position: new Vector3(c.position[0], 0, c.position[1]),
        width: c.width,
        height: c.height,
        depth: c.depth,
        texturePath: c.texturePath || worldConfig.textures.walls,
      }))
    );
  }

  return scene;
}
