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
  width: number = 20,
  depth: number = 20,
  height: number = 10,
  texturePath: string = "/roof-texture.jpg"
) {
  const roof = MeshBuilder.CreateGround(
    "roof",
    { width, height: depth },
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
  texture.uScale = width / 2;
  texture.vScale = depth / 2;

  mat.diffuseTexture = texture;
  mat.specularColor = new Color3(0.1, 0.1, 0.1);
  mat.bumpTexture = new Texture("/roof-normal.jpg", scene);


  roof.material = mat;
  roof.receiveShadows = true;
  roof.checkCollisions = true;

  return roof;
}

export default createRoof;
