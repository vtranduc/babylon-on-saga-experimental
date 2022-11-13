import {
  Scene,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  FilesInputStore,
  ISceneLoaderAsyncResult,
  Vector3,
  Mesh,
  AssetContainer,
  KeepAssets,
} from "babylonjs";
import {
  Asset3DEXT,
  EssentialMeshes,
  EXT,
  MeshCursor,
  MeshCursors,
  Primitive,
  XYZ,
} from "../../types";
import { getEXT, getPathAndName } from "../../utils";
import { NormalTracerManager } from "../cursorManagers";
import { InfiniteGrid } from "../gridManagers";

interface MeshCreationOptions {
  position?: XYZ;
}

export class AssetBuilder {
  static scene: Scene;

  public static createPrimitive(
    type: Primitive,
    options: MeshCreationOptions = {}
  ) {
    let mesh: Mesh;
    switch (type) {
      case Primitive.Sphere:
        mesh = MeshBuilder.CreateSphere("", undefined, this.scene);
        break;
      case Primitive.Capsule:
        mesh = MeshBuilder.CreateCapsule("", undefined, this.scene);
        break;
      case Primitive.IcoSphere:
        mesh = MeshBuilder.CreateIcoSphere("", undefined, this.scene);
        break;
      case Primitive.Box:
        mesh = MeshBuilder.CreateBox("", undefined, this.scene);
        break;
      default:
        throw new Error(`There is not handler for ${type}`);
    }
    this.processMesh(mesh, options);
    return mesh;
  }

  private static processMesh(mesh: Mesh, options: MeshCreationOptions) {
    if (options.position) mesh.position.fromArray(options.position);
  }
}

export function transfer123(
  container: AssetContainer,
  keepAssets: KeepAssets,
  scene: Scene
) {
  console.log("GROUP ========================");

  const {
    // actionManagers,
    animationGroups,
    animations,
    cameras,
    effectLayers,
    geometries,
    layers,
    lensFlareSystems,
    lights,
    materials,
    meshes,
    morphTargetManagers,
    multiMaterials,
    particleSystems,
    postProcesses,
    prePassRenderer,
    proceduralTextures,
    reflectionProbes,
    rootNodes,
    // scene,
    skeletons,
    sounds,
    subSurfaceConfiguration,
    textures,
    transformNodes,
  } = scene;

  if (5 === 5) return (keepAssets.cameras = cameras);

  //   Object.entries({
  //     // actionManagers,
  //     animationGroups,
  //     animations,
  //     cameras,
  //     effectLayers,
  //     geometries,
  //     layers,
  //     lensFlareSystems,
  //     lights,
  //     materials,
  //     meshes,
  //     morphTargetManagers,
  //     multiMaterials,
  //     particleSystems,
  //     postProcesses,
  //     prePassRenderer,
  //     proceduralTextures,
  //     reflectionProbes,
  //     rootNodes,
  //     // scene,
  //     skeletons,
  //     sounds,
  //     subSurfaceConfiguration,
  //     textures,
  //     transformNodes,
  //   } ).forEach([key, val] => {})

  //   container.removeAllFromScene(keepAssets);

  keepAssets.animationGroups = animationGroups.slice();
  keepAssets.animations = animations.slice();
  keepAssets.cameras = cameras.slice();
  keepAssets.effectLayers = effectLayers.slice();
  keepAssets.geometries = geometries.slice();
  keepAssets.layers = layers.slice();
  keepAssets.lensFlareSystems = lensFlareSystems.slice();
  keepAssets.lights = lights.slice();
  keepAssets.materials = materials.slice();
  keepAssets.meshes = meshes.slice();
  keepAssets.morphTargetManagers = morphTargetManagers.slice();
  keepAssets.multiMaterials = multiMaterials.slice();
  keepAssets.particleSystems = particleSystems.slice();
  keepAssets.postProcesses = postProcesses.slice();
  // keepAssets.prePassRenderer = prePassRenderer?._afterDraw();
  keepAssets.proceduralTextures = proceduralTextures.slice();
  keepAssets.reflectionProbes = reflectionProbes.slice();
  keepAssets.rootNodes = rootNodes.slice();
  keepAssets.skeletons = skeletons.slice();
  //   keepAssets.sounds = sounds.slice();
  //   keepAssets.subSurfaceConfiguration = subSurfaceConfiguration.slice();
  keepAssets.textures = textures.slice();
  keepAssets.transformNodes = transformNodes.slice();
  //   keepAssets

  //   const props = {
  //     // actionManagers,
  //     animationGroups,
  //     animations,
  //     cameras,
  //     effectLayers,
  //     geometries,
  //     layers,
  //     lensFlareSystems,
  //     lights,
  //     materials,
  //     meshes,
  //     morphTargetManagers,
  //     multiMaterials,
  //     particleSystems,
  //     postProcesses,
  //     prePassRenderer,
  //     proceduralTextures,
  //     reflectionProbes,
  //     rootNodes,
  //     // scene,
  //     skeletons,
  //     sounds,
  //     subSurfaceConfiguration,
  //     textures,
  //     transformNodes,
  //   };

  //   keepAssets = { ...keepAssets };
}
