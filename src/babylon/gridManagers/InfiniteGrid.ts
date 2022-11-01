import { Scene, Vector3, MeshBuilder } from "babylonjs";
import { InfiniteGridMaterialManager } from "../../lib";

export class InfiniteGrid {
  constructor(name: string, scene: Scene, cameraPosition: Vector3) {
    const mesh = MeshBuilder.CreateGround(
      "ground",
      { width: 2, height: 2 },
      scene
    );
    mesh.alwaysSelectAsActiveMesh = true;
    const material = new InfiniteGridMaterialManager(
      `${name}Material`,
      scene,
      cameraPosition
    );
    material.apply(mesh);
  }
}
