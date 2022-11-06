import {
  Engine,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  Vector3,
  PointerInfo,
  PointerEventTypes,
  MeshBuilder,
  SceneLoader,
  FilesInputStore,
} from "babylonjs";
import {
  Asset3DEXT,
  CssCursorStyle,
  CursorCallbacks,
  EXT,
  SetCursorStyle,
} from "../../types";
import { getEXT, getPathAndName } from "../../utils";
import { InfiniteGrid } from "../gridManagers";
import { MeshManager } from "../meshManager";

export default class SceneManager {
  private canvas = document.createElement("canvas");
  private engine = new Engine(this.canvas, true);
  private scene = new Scene(this.engine);
  private camera = new ArcRotateCamera(
    "Camera",
    Math.PI / 2,
    Math.PI / 4,
    20,
    Vector3.Zero(),
    this.scene
  );
  private resizeObserver = new ResizeObserver(() => this.engine.resize());
  private container: HTMLElement | null = null;
  private cursorCallbacks: CursorCallbacks = this.defaultCursorCallbacks;

  constructor() {
    this.canvas.style.width = this.canvas.style.height = "100%";
    this.camera.attachControl();
    this.engine.runRenderLoop(() => this.scene.render());
    new DirectionalLight("light", new Vector3(0, -1, 0), this.scene);
    // new InfiniteGrid("infiniteGrid", this.scene, this.camera.position);
    this.onPointerObservable = this.onPointerObservable.bind(this);
    this.scene.onPointerObservable.add(this.onPointerObservable);

    new MeshManager(this.scene, this.camera.position);

    // this.addCat();
    this.addSomeMeshes();
  }

  // Adding temporary objects in the scene for test purposes

  private addSomeMeshes() {
    const capsule = MeshBuilder.CreateCapsule("asdfasfasf");
    capsule.enablePointerMoveEvents = true;
    capsule.position.set(1, 1, 1);

    const box = MeshBuilder.CreateBox("");
    box.enablePointerMoveEvents = true;
    box.position.set(-1, 1, 1);

    const sphere = MeshBuilder.CreateSphere("");
    sphere.enablePointerMoveEvents = true;
    sphere.position.set(-1, 1, -1);

    // sphere.geometry = box.geometry

    const a = MeshBuilder.CreateIcoSphere("");
    a.enablePointerMoveEvents = true;
    a.position.set(1, 1, -1);

    setTimeout(() => {
      this.scene.removeMesh(capsule);
    }, 2000);

    setTimeout(() => {
      this.scene.addMesh(capsule);
    }, 3000);

    console.log("show the mesh? ", capsule, this.scene);
  }

  private addCat() {
    SceneLoader.ImportMesh(
      "",
      "./models/cat-girl-ffxiv/",
      "scene.gltf",
      this.scene,
      (meshes) =>
        meshes.forEach((mesh, i) => (mesh.enablePointerMoveEvents = true))
    );
  }

  // Getters and Setters

  public get renderScene() {
    return this.scene;
  }

  // Public methods

  // Canvas handlers

  public setCanvasContainer(element: HTMLElement) {
    let cursorStyle: string = CssCursorStyle.Standard;
    if (this.container) {
      this.container.removeChild(this.canvas);
      this.resizeObserver.disconnect();
      cursorStyle = this.container.style.cursor;
      this.container.style.cursor = CssCursorStyle.Standard;
    }
    this.container = element;
    this.container.style.cursor = cursorStyle;
    this.resizeObserver.observe(this.container);
    this.container.appendChild(this.canvas);
    this.engine.resize();
  }

  // CursorHandlers

  public loadCursorCallbacks(
    getCallbacks: (setCursorStyle: SetCursorStyle) => Partial<CursorCallbacks>
  ) {
    this.cursorCallbacks = {
      ...this.defaultCursorCallbacks,
      ...getCallbacks(this.setCursorStyle),
    };
  }

  public resetCursor() {
    if (this.container) this.container.style.cursor = CssCursorStyle.Standard;
    this.cursorCallbacks = this.defaultCursorCallbacks;
  }

  // Load all files in the store

  public async loadAllFiles() {
    const pathNameCombined = Object.keys(FilesInputStore.FilesToLoad);
    for (let i = pathNameCombined.length - 1; i >= 0; i--) {
      const fullPath = pathNameCombined[i];
      const ext = getEXT(fullPath);
      if (!ext || !([Asset3DEXT.GLB, Asset3DEXT.GLTF] as EXT[]).includes(ext))
        continue;
      const { path, name } = getPathAndName(fullPath);
      try {
        const abc = await SceneLoader.ImportMeshAsync(
          "",
          `file:${path}`,
          name,
          this.scene,
          null,
          ext
        );

        const meshes = abc.meshes;

        const timer = setInterval(() => {
          const mesh = meshes.shift();

          if (!mesh) {
            console.log("done!");
            clearInterval(timer);
            return;
          }

          console.log("remove this: ", mesh);
          this.scene.removeMesh(mesh);
        }, 1000);

        console.log(
          "show abc ----> ",
          abc,
          name,
          this.scene.getMeshByName("yaminoma!")
        );
      } catch {
        throw new Error("Encountered error in loading " + fullPath);
      }
    }
  }

  // Utils

  // Pointer utils

  private get setCursorStyle(): SetCursorStyle {
    return (style: CssCursorStyle) => {
      if (!this.container || this.container.style.cursor === style) return;
      this.container.style.cursor = style;
    };
  }

  private get defaultCursorCallbacks(): CursorCallbacks {
    return {
      move: () => {},
      wheel: () => {},
      dragStart: () => {},
      dragEnd: () => {},
    };
  }

  private onPointerObservable(pointerInfo: PointerInfo) {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERDOWN:
        this.onPointerDown(pointerInfo);
        break;
      case PointerEventTypes.POINTERUP:
        this.onPointerUp(pointerInfo);
        break;
      case PointerEventTypes.POINTERWHEEL:
        this.onPointerWheel(pointerInfo);
        break;
      case PointerEventTypes.POINTERMOVE:
        this.onPointerMove(pointerInfo);
        break;
      default:
    }
  }

  private onPointerUp(pointerInfo: PointerInfo) {
    this.cursorCallbacks.dragEnd(pointerInfo, this.camera.position);
  }

  private onPointerDown(pointerInfo: PointerInfo) {
    this.cursorCallbacks.dragStart(pointerInfo, this.camera.position);
  }

  private onPointerWheel(pointerInfo: PointerInfo) {
    this.cursorCallbacks.wheel(pointerInfo, this.camera.position);
  }

  private onPointerMove(pointerInfo: PointerInfo) {
    this.cursorCallbacks.move(pointerInfo, this.camera.position);
  }
}
