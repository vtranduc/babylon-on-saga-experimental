import { Node, Scene } from "babylonjs";
import { ScenePreset, Tree } from "../../types";
import { AssetLibraryManager } from "../assetLibraryManager.ts";
import { AssetLoader } from "../assetLoader";
import { PresetManager } from "../presetManager";
import { UtilityAssetManager } from "../UtilityAssetManager";
import { DisposeHelper } from "./disposeHelper";

export class SceneAssetManager {
  private scene: Scene;
  private dipose: DisposeHelper;
  private utilAssetManager: UtilityAssetManager;
  private presetManager: PresetManager;
  private loader: AssetLoader;
  private library: AssetLibraryManager;

  constructor(scene: Scene) {
    this.scene = scene;
    this.utilAssetManager = new UtilityAssetManager(this.scene);
    this.loader = new AssetLoader(this.scene);
    this.library = new AssetLibraryManager(this.scene, this.loader);
    this.dipose = new DisposeHelper(scene, this.library);
    this.presetManager = new PresetManager(this.scene, this.library);
  }

  public get cameraPosition() {
    return this.utilAssetManager.cameraPosition;
  }

  public loadLibrary() {
    return this.library.loadModels();
  }

  public keepAllAssets() {
    this.dipose.keepAllAssetsInScene();
  }

  public get cursors() {
    return this.utilAssetManager.cursors;
  }

  public setPreset(preset: ScenePreset) {
    this.presetManager.set(preset);
  }

  public clearAll() {
    this.dipose.diposeAll();
  }

  public async loadAllFiles() {
    const containers = await this.loader.loadAllFiles();
    containers.forEach((container) => container.addAllToScene());
  }

  // TO DO: Enable normal tracer by setting enablePointerMoveEvents to true

  // private enablePointerOnAllMeshes() {
  //   this.dipose.disposableMeshes.forEach(
  //     (mesh) => (mesh.enablePointerMoveEvents = true)
  //   );
  // }

  public get tree(): Tree[] {
    return this.scene
      .getNodes()
      .filter((child) => !child.parent)
      .map((child) => this.getNodeTree(child));
  }

  private getNodeTree(node: Node): Tree {
    return {
      id: node.uniqueId,
      name: node.name,
      children: node.getChildren().map((child) => this.getNodeTree(child)),
    };
  }
}
