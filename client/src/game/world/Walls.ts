import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  Color3,
} from "babylonjs";

export interface WallConfig {
  texturePath?: string;
  width?: number;
  height?: number;
  depth?: number;
  position?: Vector3;
  tileSize?: number; // NEW: meters per texture tile
}

export function createWalls(scene: Scene, config: WallConfig = {}) {
  const {
    texturePath,
    width = 1,
    height = 3,
    depth = 0.2,
    position = new Vector3(0, height / 2, 0),
    tileSize = 1, // 1 texture tile per 1 world unit
  } = config;

  const wall = MeshBuilder.CreateBox("wall", { width, height, depth }, scene);

  wall.position = position;

  const mat = new StandardMaterial("wallMat", scene);

  if (texturePath) {
    const texture = new Texture(texturePath, scene);
    texture.wrapU = Texture.WRAP_ADDRESSMODE;
    texture.wrapV = Texture.WRAP_ADDRESSMODE;

    /**
     * Tile based on dominant face size
     * Use the larger of width/depth for horizontal scaling since walls can be oriented differently
     * This ensures consistent texture orientation regardless of wall orientation
     */
    const faceWidth = Math.max(width, depth);
    texture.uScale = faceWidth / tileSize;
    texture.vScale = height / tileSize;

    mat.diffuseTexture = texture;
  } else {
    mat.diffuseColor = new Color3(0.6, 0.4, 0.3);
  }

  mat.specularColor = new Color3(0.1, 0.1, 0.1);
  wall.material = mat;

  wall.receiveShadows = true;
  wall.checkCollisions = true;

  return wall;
}

/**
 * Create multiple walls to form a room or boundary on 4 sides
 */
export function createWallBoundary(
  scene: Scene,
  texturePath: string | undefined = undefined,
  width: number = 30,
  depth: number = 30,
  wallHeight: number = 10,
  tileSize: number = 1,
  wallThickness: number = 0.2
) {
  const walls: any[] = [];
  const halfWidth = width / 2;
  const halfDepth = depth / 2;

  // North wall (positive Z)
  walls.push(createWalls(scene, {
    texturePath,
    width,
    height: wallHeight,
    depth: wallThickness,
    position: new Vector3(0, wallHeight / 2, halfDepth),
    tileSize,
  }));

  // South wall (negative Z)
  walls.push(createWalls(scene, {
    texturePath,
    width,
    height: wallHeight,
    depth: wallThickness,
    position: new Vector3(0, wallHeight / 2, -halfDepth),
    tileSize,
  }));

  // East wall (positive X)
  walls.push(createWalls(scene, {
    texturePath,
    width: wallThickness,
    height: wallHeight,
    depth,
    position: new Vector3(halfWidth, wallHeight / 2, 0),
    tileSize,
  }));

  // West wall (negative X)
  walls.push(createWalls(scene, {
    texturePath,
    width: wallThickness,
    height: wallHeight,
    depth,
    position: new Vector3(-halfWidth, wallHeight / 2, 0),
    tileSize,
  }));

  return walls;
}

export default createWalls;
