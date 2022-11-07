import { Mesh, Scene } from "babylonjs";
import { CursorCallbacks, SetCursorStyle } from "../../types";
import { BaseMeshManager } from "../baseMeshManager";

export default abstract class CursorManager extends BaseMeshManager {
  protected abstract mesh: Mesh;
  protected name: string;
  protected scene: Scene;

  constructor(name: string, scene: Scene) {
    super();
    this.name = name;
    this.scene = scene;
  }

  public abstract get getCursorCallbacks(): (
    setCursorStyle: SetCursorStyle
  ) => Partial<CursorCallbacks>;
}
