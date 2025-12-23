import { Scene, MeshBuilder, Vector3, Mesh, Camera } from 'babylonjs';

export class Snowman {
  private scene: Scene;
  private rootMesh: Mesh;

  constructor(scene: Scene, position: Vector3 = Vector3.Zero(), camera?: Camera) {
    this.scene = scene;
    this.rootMesh = new Mesh('snowman', scene);
    this.rootMesh.position = position;

    // Enable collisions for the snowman and define a simple collision shape
    this.rootMesh.checkCollisions = true;
    (this.rootMesh as any).ellipsoid = new Vector3(0.5, 1, 0.5);
    (this.rootMesh as any).ellipsoidOffset = new Vector3(0, 1, 0);

    this.createSnowman();
    if (camera) {
      this.attachCamera(camera);
    }
  }

  private createSnowman() {
    // Bottom sphere (largest)
    const bottom = MeshBuilder.CreateSphere('bottom', { diameter: 1 }, this.scene);
    bottom.position.y = 0.5;
    bottom.parent = this.rootMesh;

    // Middle sphere
    const middle = MeshBuilder.CreateSphere('middle', { diameter: 0.4 }, this.scene);
    middle.position.y = 1.2;
    middle.parent = this.rootMesh;

  }

  private attachCamera(camera: Camera) {
    camera.parent = this.rootMesh;
    camera.position = new Vector3(0, 2.5, 0.2); // Position camera at snowman's eye level, slightly forward
    (camera as any).setTarget(new Vector3(0, 1.85, 1)); // Look forward
  }

  public getMesh(): Mesh {
    return this.rootMesh;
  }
}
