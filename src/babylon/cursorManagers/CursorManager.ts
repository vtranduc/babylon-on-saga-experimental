import { Mesh, Scene } from "babylonjs";
import { CursorCallbacks, SetCursorStyle } from "../../types";

export default abstract class CursorManager {
  protected abstract mesh: Mesh;

  protected name: string;
  protected scene: Scene;

  constructor(name: string, scene: Scene) {
    this.name = name;
    this.scene = scene;
  }

  public abstract get getCursorCallbacks(): (
    setCursorStyle: SetCursorStyle
  ) => Partial<CursorCallbacks>;
}
