import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  Vector3,
} from "babylonjs";

export function createGround(
  scene: Scene,
  size: number = 20,
  texturePath: string | undefined = undefined,
  tileSize: number = 1
) {
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: size, height: size },
    scene
  );

  // Position ground at y=0
  ground.position.y = 0;

  const mat = new StandardMaterial("groundMat", scene);

  if (texturePath) {
    const texture = new Texture(texturePath, scene);
    texture.wrapU = Texture.WRAP_ADDRESSMODE;
    texture.wrapV = Texture.WRAP_ADDRESSMODE;
    
    // Tile texture based on size and tileSize
    texture.uScale = size / tileSize;
    texture.vScale = size / tileSize;

    mat.diffuseTexture = texture;
  } else {
    // Fallback: use a grass-like color if no texture
    mat.diffuseColor = new Color3(0.2, 0.5, 0.2);
  }

  mat.specularColor = new Color3(0, 0, 0);

  ground.material = mat;
  ground.receiveShadows = true;
  ground.checkCollisions = true;

  return ground;
}

