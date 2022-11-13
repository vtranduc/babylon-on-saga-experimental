import { FilesInputStore, Scene, SceneLoader, AssetContainer } from "babylonjs";
import { Asset3DEXT, EXT } from "../../types";
import { getEXT, getPathAndName } from "../../utils";

export class AssetLoader {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public async loadProjectAsset(url: string, name: string) {
    return await SceneLoader.LoadAssetContainerAsync(url, name, this.scene);
  }

  public async loadAllFiles() {
    const pathNameCombined = Object.keys(FilesInputStore.FilesToLoad);
    const containers: AssetContainer[] = [];
    for (let i = pathNameCombined.length - 1; i >= 0; i--) {
      const fullPath = pathNameCombined[i];
      const ext = getEXT(fullPath);
      if (!ext || !([Asset3DEXT.GLB, Asset3DEXT.GLTF] as EXT[]).includes(ext))
        continue;
      const { path, name } = getPathAndName(fullPath);
      try {
        const result = await SceneLoader.LoadAssetContainerAsync(
          `file:${path}`,
          name,
          this.scene,
          undefined,
          ext
        );
        containers.push(result);
      } catch {
        throw new Error("Encountered error in loading " + fullPath);
      }
    }
    return containers;
  }
}
