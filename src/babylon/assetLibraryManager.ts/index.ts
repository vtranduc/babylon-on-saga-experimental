import { AssetContainer, Scene } from "babylonjs";
import { LibraryModel } from "../../types";
import { AssetLoader } from "../assetLoader";

type AssetLibraryModels = Record<LibraryModel, AssetContainer>;

type ModelAssetData = Record<LibraryModel, { url: string; name: string }>;

const modelAssetData: ModelAssetData = {
  [LibraryModel.Miqote]: {
    url: "./models/cat-girl-ffxiv/",
    name: "scene.gltf",
  },
};

export class AssetLibraryManager {
  private scene: Scene;
  private models: AssetLibraryModels;
  private loader: AssetLoader;

  constructor(scene: Scene, loader: AssetLoader) {
    this.scene = scene;
    this.loader = loader;
    const placeholderContainer = new AssetContainer(this.scene);
    this.models = Object.values(LibraryModel).reduce(
      (acc, model) => ({ ...acc, [model]: placeholderContainer }),
      {}
    ) as AssetLibraryModels;
  }

  public async loadModels() {
    for (let model of Object.values(LibraryModel)) {
      this.models[model] = await this.loader.loadProjectAsset(
        modelAssetData[model].url,
        modelAssetData[model].name
      );
    }
  }

  public addModel(model: LibraryModel) {
    this.models[model].addAllToScene();
  }

  public removeAllFromScene() {
    Object.values(this.models).forEach((container) =>
      container.removeAllFromScene()
    );
  }
}
