import { Mesh, Scene, Vector3 } from 'babylonjs';

export class SnowmanController {
  private mesh: Mesh;
  private speed: number = 0.08;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }

  public move(direction: Vector3) {
    this.mesh.position.addInPlace(direction);
  }

  // Add more snowman-specific logic here
}
