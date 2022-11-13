import { AbstractMesh, EffectLayer, KeepAssets, Mesh } from "babylonjs";
import { ThinSprite } from "babylonjs/Sprites/thinSprite";
import { UniqueId } from "../../types";

export abstract class BaseMeshManager {
  protected abstract mesh: Mesh;

  public get uniqueId(): UniqueId {
    return this.mesh.uniqueId;
  }

  public keepAsset(keepAssets: KeepAssets): void {
    keepAssets.meshes.push(this.mesh);
    if (this.mesh.geometry) keepAssets.geometries.push(this.mesh.geometry);
    if (this.mesh.material) keepAssets.materials.push(this.mesh.material);

    // this.mesh._scene = new

    // const a=  this.mesh.actionManager
    // this.mesh.layer

    // const a = EffectLayer
  }
}
