import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Color3,
  Vector3,
} from "babylonjs";

export function createRoof(
  scene: Scene,
  size: number = 20,
  height: number = 10,
  texturePath: string = "/roof-texture.jpg"
) {
  const roof = MeshBuilder.CreateGround(
    "roof",
    { width: size, height: size },
    scene
  );

  // Position roof on top of walls
  roof.position.y = height;
  roof.rotation.x = Math.PI; // flip normals downward

  const mat = new StandardMaterial("roofMat", scene);

  const texture = new Texture(texturePath, scene);
  texture.wrapU = Texture.WRAP_ADDRESSMODE;
  texture.wrapV = Texture.WRAP_ADDRESSMODE;

  // Tile texture instead of stretching
  texture.uScale = size / 2;
  texture.vScale = size / 2;

  mat.diffuseTexture = texture;
  mat.specularColor = new Color3(0.1, 0.1, 0.1);
  mat.bumpTexture = new Texture("/roof-normal.jpg", scene);


  roof.material = mat;
  roof.receiveShadows = true;
  roof.checkCollisions = true;

  return roof;
}

export default createRoof;
