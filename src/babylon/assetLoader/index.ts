import {
  Scene,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  FilesInputStore,
  ISceneLoaderAsyncResult,
  Vector3,
} from "babylonjs";
import {
  Asset3DEXT,
  EssentialMeshes,
  EXT,
  MeshCreationOptions,
  MeshCursor,
  MeshCursors,
  Primitive,
  XYZ,
} from "../../types";
import { getEXT, getPathAndName } from "../../utils";
import { NormalTracerManager } from "../cursorManagers";
import { InfiniteGrid } from "../gridManagers";

export class AssetLoader {
  static scene: Scene;

  public static async loadProjectAsset(
    url: string,
    name: string,
    options: MeshCreationOptions = {}
  ) {
    const {
      animationGroups,
      meshes,
      transformNodes,
      lights,
      particleSystems,
      geometries,
      skeletons,
    } = await SceneLoader.ImportMeshAsync("", url, name, this.scene);

    return {
      animationGroups,
      meshes,
      transformNodes,
      lights,
      particleSystems,
      geometries,
      skeletons,
    };
  }

  public static async loadAllFiles(options: MeshCreationOptions = {}) {
    const pathNameCombined = Object.keys(FilesInputStore.FilesToLoad);
    const loadedMeshes: AbstractMesh[] = [];
    for (let i = pathNameCombined.length - 1; i >= 0; i--) {
      const fullPath = pathNameCombined[i];
      const ext = getEXT(fullPath);
      if (!ext || !([Asset3DEXT.GLB, Asset3DEXT.GLTF] as EXT[]).includes(ext))
        continue;
      const { path, name } = getPathAndName(fullPath);
      try {
        const result = await SceneLoader.ImportMeshAsync(
          "",
          `file:${path}`,
          name,
          this.scene,
          null,
          ext
        );
        // loadedMeshes.push(...this.processSceneLoaderResult(result, {}));

        // const a= result.
      } catch {
        throw new Error("Encountered error in loading " + fullPath);
      }
    }
    return loadedMeshes;
  }
}
