import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  Color3,
  Mesh,
} from "babylonjs";

export interface ObstructionConfig {
  position: Vector3;      // Center position of the obstruction
  width?: number;         // Width (X dimension)
  height?: number;        // Height (Y dimension)
  depth?: number;         // Depth (Z dimension)
  texturePath?: string;  // Optional texture path
  color?: Color3;         // Fallback color if no texture
}

/**
 * Create a single obstruction (miniwall/barrier) in the arena
 */
export function createObstruction(
  scene: Scene,
  config: ObstructionConfig
): Mesh {
  const {
    position,
    width = 2,
    height = 4, // Default to camera height
    depth = 0.5,
    texturePath,
    color = new Color3(0.7, 0.7, 0.7), // Default gray color
  } = config;

  const obstruction = MeshBuilder.CreateBox(
    `obstruction_${position.x}_${position.z}`,
    { width, height, depth },
    scene
  );

  obstruction.position = position;
  // Position so bottom is at ground level
  obstruction.position.y = height / 2;

  const mat = new StandardMaterial(`obstructionMat_${position.x}_${position.z}`, scene);

  if (texturePath) {
    const texture = new Texture(texturePath, scene);
    texture.wrapU = Texture.WRAP_ADDRESSMODE;
    texture.wrapV = Texture.WRAP_ADDRESSMODE;
    texture.uScale = width / 1; // 1 unit per tile
    texture.vScale = height / 1;
    mat.diffuseTexture = texture;
  } else {
    mat.diffuseColor = color;
  }

  mat.specularColor = new Color3(0.1, 0.1, 0.1);
  obstruction.material = mat;

  obstruction.receiveShadows = true;
  obstruction.checkCollisions = true; // Enable collisions

  return obstruction;
}

/**
 * Create multiple obstructions from a configuration array
 */
export function createObstructions(
  scene: Scene,
  configs: ObstructionConfig[]
): Mesh[] {
  return configs.map((config) => createObstruction(scene, config));
}

/**
 * Create a miniwall (shorter wall segment) - convenience function
 */
export function createMiniwall(
  scene: Scene,
  position: Vector3,
  width: number = 3,
  height: number = 2,
  depth: number = 0.5,
  texturePath?: string
): Mesh {
  return createObstruction(scene, {
    position,
    width,
    height,
    depth,
    texturePath,
  });
}
