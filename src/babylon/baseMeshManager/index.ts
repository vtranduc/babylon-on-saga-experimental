import { AbstractMesh } from "babylonjs";
import { UniqueId } from "../../types";

export abstract class BaseMeshManager {
  protected abstract mesh: AbstractMesh;

  public get uniqueId(): UniqueId {
    return this.mesh.uniqueId;
  }
}
