import {
  Scene,
  Vector3,
  AbstractMesh,
  Node,
  SkeletonViewer,
  Skeleton,
  MeshBuilder,
  TransformNode,
  Mesh,
  Bone,
  Camera,
  ArcRotateCamera,
  DirectionalLight,
  Light,
  Nullable,
} from "babylonjs";
import { disposeEmitNodes } from "typescript";
import {
  EssentialMeshes,
  MeshCursors,
  Primitive,
  ScenePreset,
  Tree,
  UniqueId,
  XYZ,
} from "../../types";
import { AssetLoader } from "../assetLoader";
import { MeshHelper } from "../meshManager";
// import { MeshCreator } from "./MeshCreator";

export class SceneHelper {
  private scene: Scene;
  private essentialMeshes: EssentialMeshes;
  //   private meshCreator: MeshCreator;
  private essentialNodeIds: UniqueId[] = [];
  private cursors: MeshCursors;
  private essentialLight: Light;
  private camera: Camera;

  constructor(scene: Scene) {
    this.scene = scene;
    const { camera, light, cursors, meshes } = this.createEssentialNodes();
    this.camera = camera;
    this.essentialLight = light;
    this.cursors = cursors;
    this.essentialMeshes = meshes;
    this.essentialNodeIds.push(
      camera.uniqueId,
      light.uniqueId,
      ...Object.values(cursors).map((cursor) => cursor.uniqueId),
      ...Object.values(meshes).map((mesh) => mesh.uniqueId)
    );

    this.camera.attachControl();

    console.log(
      "show essentials ---> ",
      this.essentialNodeIds,
      this.scene.transformNodes,
      this.scene.meshes
    );

    // this.ab(0);

    // this.getNodeByUniqueId(31);
  }

  public get cameraPosition() {
    return this.camera.position;
  }

  public get meshCursors() {
    return this.cursors;
  }

  public get tree(): Tree[] {
    console.log("getting tree but also show bones: ", this.scene.skeletons);

    return this.firstGenerationMeshes.map((mesh) => this.getTree(mesh));
  }

  private get firstGenerationMeshes(): Node[] {
    return this.scene
      .getNodes()
      .filter((node) => this.isInteractive(node) && !node.parent);
  }

  private getTree(node: Node): Tree {
    return {
      id: node.uniqueId,
      name: node.name,
      children: node
        .getChildren()
        .filter((child) => this.isInteractive(child))
        .map((child) => this.getTree(child)),
    };
  }

  public clearAllTransformNodesAndMeshes() {
    this.scene.transformNodes.slice().forEach((node) => {
      if (!this.isInteractive(node)) return;
      this.scene.removeTransformNode(node);
      node.dispose(true, false);
    });

    this.scene.meshes.slice().forEach((mesh) => {
      if (!this.isInteractive(mesh)) return;
      this.scene.removeMesh(mesh, false);
      mesh.dispose(true, false);
    });

    this.scene.lights.slice().forEach((light) => {
      if (!this.isInteractive(light)) return;
      this.scene.removeLight(light);
      light.dispose();
    });

    this.scene.cameras.slice().forEach((camera) => {
      if (!this.isInteractive(camera)) return;
      this.scene.removeCamera(camera);
      camera.dispose();
    });

    this.scene.skeletons.slice().forEach((skeleton) => {
      this.scene.removeSkeleton(skeleton);
      skeleton.dispose();
    });

    this.scene.particleSystems.slice().forEach((system) => {
      this.scene.removeParticleSystem(system);
      system.dispose();
    });

    this.scene.geometries.slice().forEach((geometry) => {
      this.scene.removeGeometry(geometry);
      geometry.dispose();
    });

    this.scene.materials.slice().forEach((material) => {
      this.scene.removeMaterial(material);
      material.dispose();
    });

    this.scene.textures.slice().forEach((texture) => {
      this.scene.removeTexture(texture);
      texture.dispose();
    });

    this.scene.animationGroups.slice().forEach((group) => {
      this.scene.removeAnimationGroup(group);
      group.dispose();
    });

    this.scene.animations
      .slice()
      .forEach((animation) => this.scene.removeAnimation(animation));
  }

  public loadAllFiles() {
    return AssetLoader.loadAllFiles();
  }

  //   public clearTransformNode() {}

  //   private remove(id: UniqueId) {
  //     const node = this.getNodeByUniqueId(id);
  //     if (!node) return;
  //     node.getClassName();
  //   }

  //   // WARNING: This ignores the bones

  //   private getNodeByUniqueId(id: UniqueId): Nullable<Node> {
  //     const ske = new Skeleton("", "", this.scene);
  //     const abc = new Bone("", ske);
  //     abc.id = abc.uniqueId.toString();

  //     const mesh = MeshBuilder.CreateBox("");

  //     //

  //     this.scene.removeTransformNode(mesh);

  //     // this.scene.removeMesh()

  //     console.log(
  //       "tough call: ",
  //       mesh.uniqueId,
  //       id,
  //       this.scene.getTransformNodeByUniqueId(id) ||
  //         this.scene.getLightByUniqueId(id) ||
  //         this.scene.getCameraByUniqueId(id)
  //       // this.scene.getMeshByUniqueId(id)
  //     );

  //     // abc.uniqueId;

  //     // console.log(
  //     //   "show yu ",
  //     //   ske.uniqueId,
  //     //   abc.uniqueId,
  //     //   this.scene.getSkeletonByUniqueId(30),
  //     //   this.scene.uniq,
  //     //   "start",
  //     //   abc.id,
  //     //   "fin"
  //     // );

  //     // id = 30;

  //     // this.scene.materials

  //     return (
  //       this.scene.getTransformNodeByUniqueId(id) ||
  //       this.scene.getLightByUniqueId(id) ||
  //       this.scene.getCameraByUniqueId(id)
  //     );

  //     // console.log("show result ---> ", id, abc2);
  //   }

  public async setPreset(preset: ScenePreset) {
    // this.clearAll();

    switch (preset) {
      case ScenePreset.PrimitiveObjects:
        this.primitivePreset();
        break;
      case ScenePreset.Miqote:
        await this.miqotePreset();
        break;
      default:
    }
  }

  private primitivePreset() {
    const capsule = MeshHelper.createPrimitive(Primitive.Capsule, {
      position: [1, 1, 1],
    });
    const box = MeshHelper.createPrimitive(Primitive.Box, {
      position: [-1, 1, 1],
    });
    const sphere = MeshHelper.createPrimitive(Primitive.Sphere, {
      position: [-1, 1, -1],
    });
    const icoSphere = MeshHelper.createPrimitive(Primitive.IcoSphere, {
      position: [1, 1, -1],
    });

    [capsule, box, sphere, icoSphere].forEach((mesh) => {
      //   this.enablePointer(mesh.uniqueId);
    });
  }

  private async miqotePreset() {
    const meshes = await AssetLoader.loadProjectAsset(
      "./models/cat-girl-ffxiv/",
      "scene.gltf"
    );
    // meshes.forEach((mesh) => {
    //   this.add(mesh);
    //   this.enablePointer(mesh.uniqueId);
    // });
  }

  private isInteractive(node: Node) {
    return !this.essentialNodeIds.includes(node.uniqueId);
  }

  private createEssentialNodes() {
    const camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 4,
      20,
      Vector3.Zero(),
      this.scene
    );
    const light = new DirectionalLight(
      "light",
      new Vector3(0, -1, 0),
      this.scene
    );
    const cursors = MeshHelper.createMeshCursors();
    const meshes = MeshHelper.createEssentialMeshes(camera.position);
    return { camera, light, cursors, meshes };
  }
}
