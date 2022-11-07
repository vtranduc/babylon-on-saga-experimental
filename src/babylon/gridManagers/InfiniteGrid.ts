import { Scene, Vector3, MeshBuilder, GroundMesh } from "babylonjs";
import { InfiniteGridMaterialManager } from "../../lib";

export class InfiniteGrid {
  private mesh: GroundMesh;

  constructor(name: string, scene: Scene, cameraPosition: Vector3) {
    this.mesh = MeshBuilder.CreateGround(
      "ground",
      { width: 2, height: 2 },
      scene
    );
    this.mesh.alwaysSelectAsActiveMesh = true;
    const material = new InfiniteGridMaterialManager(
      `${name}Material`,
      scene,
      cameraPosition
    );
    material.apply(this.mesh);
  }

  public get uniqueId() {
    return this.mesh.uniqueId;
  }
}
