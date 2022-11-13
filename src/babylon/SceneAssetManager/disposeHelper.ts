import { AssetContainer, KeepAssets, Scene } from "babylonjs";
import { Asset } from "../../types";
import { AssetLibraryManager } from "../assetLibraryManager.ts";

export class DisposeHelper {
  private scene: Scene;
  private keepAssets = new KeepAssets();
  private bin: AssetContainer;
  private library: AssetLibraryManager;

  constructor(scene: Scene, library: AssetLibraryManager) {
    this.scene = scene;
    this.library = library;
    this.bin = new AssetContainer(scene);
  }

  public get keepMeshUniqueIds() {
    return this.keepAssets.meshes.map((mesh) => mesh.uniqueId);
  }

  public get disposableMeshes() {
    const keepIds = this.keepMeshUniqueIds;
    return this.scene.meshes.filter((mesh) => !keepIds.includes(mesh.uniqueId));
  }

  public diposeAll() {
    this.library.removeAllFromScene();
    this.bin.moveAllFromScene(this.keepAssets);
    this.bin.removeAllFromScene();
    this.bin.dispose();
  }

  public keepAllAssetsInScene(types: Asset[] = Object.values(Asset)) {
    types.forEach((type) => {
      switch (type) {
        case Asset.AnimationGroup:
          this.keepAssets.animationGroups = this.scene.animationGroups?.slice();
          break;
        case Asset.Animation:
          this.keepAssets.animations = this.scene.animations?.slice();
          break;

        case Asset.Camera:
          this.keepAssets.cameras = this.scene.cameras?.slice();
          break;

        case Asset.EffectLayer:
          this.keepAssets.effectLayers = this.scene.effectLayers?.slice();
          break;
        case Asset.Geometry:
          this.keepAssets.geometries = this.scene.geometries?.slice();
          break;
        case Asset.Layer:
          this.keepAssets.layers = this.scene.layers?.slice();
          break;

        case Asset.LensFlareSystem:
          this.keepAssets.lensFlareSystems =
            this.scene.lensFlareSystems?.slice();
          break;
        case Asset.Light:
          this.keepAssets.lights = this.scene.lights?.slice();
          break;
        case Asset.Material:
          this.keepAssets.materials = this.scene.materials?.slice();
          break;
        case Asset.Mesh:
          this.keepAssets.meshes = this.scene.meshes?.slice();
          break;
        case Asset.MorphTargetManager:
          this.keepAssets.morphTargetManagers =
            this.scene.morphTargetManagers?.slice();
          break;

        case Asset.MultiMaterial:
          this.keepAssets.multiMaterials = this.scene.multiMaterials?.slice();
          break;
        case Asset.ParticleSystem:
          this.keepAssets.particleSystems = this.scene.particleSystems?.slice();
          break;
        case Asset.PostProcess:
          this.keepAssets.postProcesses = this.scene.postProcesses?.slice();
          break;
        case Asset.PrePassRenderer:
          this.keepAssets.prePassRenderer = this.scene.prePassRenderer;
          break;
        case Asset.ProceduralTexture:
          this.keepAssets.proceduralTextures =
            this.scene.proceduralTextures?.slice();
          break;

        case Asset.ReflectionProbe:
          this.keepAssets.reflectionProbes =
            this.scene.reflectionProbes?.slice();
          break;
        case Asset.RootNode:
          this.keepAssets.rootNodes = this.scene.rootNodes?.slice();
          break;
        case Asset.Skeleton:
          this.keepAssets.skeletons = this.scene.skeletons?.slice();
          break;
        case Asset.Sound:
          this.keepAssets.sounds =
            this.scene.sounds && this.scene.sounds?.slice();
          break;
        case Asset.SubSurfaceConfiguration:
          this.keepAssets.subSurfaceConfiguration =
            this.scene.subSurfaceConfiguration;
          break;

        case Asset.Texture:
          this.keepAssets.textures = this.scene.textures?.slice();
          break;
        case Asset.TransformNode:
          this.keepAssets.transformNodes = this.scene.transformNodes?.slice();
          break;

        default:
      }
    });
  }
}
