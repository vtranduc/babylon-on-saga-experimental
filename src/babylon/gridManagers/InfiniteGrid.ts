import { Scene, Vector3, MeshBuilder, Mesh } from "babylonjs";
import { InfiniteGridMaterialManager } from "../../lib";
import { BaseMeshManager } from "../baseMeshManager";

export class InfiniteGrid extends BaseMeshManager {
  protected mesh: Mesh;

  constructor(name: string, scene: Scene, cameraPosition: Vector3) {
    super();
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
}
