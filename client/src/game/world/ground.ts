import { Scene, MeshBuilder, StandardMaterial, Color3 } from 'babylonjs';

export function createGround(scene: Scene) {
  const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene);

  const mat = new StandardMaterial('groundMat', scene);
  mat.diffuseColor = new Color3(0.2, 0.5, 0.2);
  mat.specularColor = new Color3(0, 0, 0);
  ground.material = mat;

  ground.receiveShadows = true;

  return ground;
}

export default createGround;
