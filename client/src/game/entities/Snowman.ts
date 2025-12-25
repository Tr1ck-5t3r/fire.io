import {
  Scene,
  MeshBuilder,
  Vector3,
  Mesh,
  TransformNode,
  Camera,
} from "babylonjs";

export class Snowman {
  private scene: Scene;
  private rootMesh: Mesh;
  private cameraPivot!: TransformNode;

  constructor(scene: Scene, position: Vector3, camera: Camera) {
    this.scene = scene;

    // Root = physics body
    this.rootMesh = new Mesh("snowmanRoot", scene);
    this.rootMesh.position = position;
    this.rootMesh.checkCollisions = true;    

    (this.rootMesh as any).ellipsoid = new Vector3(1, 2, 1);
    (this.rootMesh as any).ellipsoidOffset = new Vector3(0, 2, 0);

    this.createSnowman();
    this.attachCamera(camera);
  }

  private createSnowman() {
    const bottom = MeshBuilder.CreateSphere(
      "bottom",
      { diameter: 2 },
      this.scene
    );
    bottom.position.y = 1;
    bottom.parent = this.rootMesh;

    const middle = MeshBuilder.CreateSphere(
      "middle",
      { diameter: 1.2 },
      this.scene
    );
    middle.position.y = 2.6;
    middle.parent = this.rootMesh;

    const head = MeshBuilder.CreateSphere(
      "head",
      { diameter: 0.8 },
      this.scene
    );
    head.position.y = 3.8;
    head.parent = this.rootMesh;
  }

  private attachCamera(camera: Camera) {
    this.cameraPivot = new TransformNode("cameraPivot", this.scene);
    this.cameraPivot.parent = this.rootMesh;
    this.cameraPivot.position = new Vector3(0, 3.6, 0);

    camera.parent = this.cameraPivot;
    camera.position = new Vector3(0, 0, 0.3);
  }

  move(delta: Vector3) {
    this.rootMesh.moveWithCollisions(delta);
  }

  rotateYaw(yaw: number) {
    this.rootMesh.rotation.y = yaw;
  }

  rotatePitch(pitch: number) {
    this.cameraPivot.rotation.x = pitch;
  }

  getMesh(): Mesh {
    return this.rootMesh;
  }
}
