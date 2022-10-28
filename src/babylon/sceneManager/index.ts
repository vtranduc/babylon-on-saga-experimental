import {
  Engine,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  MeshBuilder,
  Vector3,
  PointerInfo,
  PointerEventTypes,
} from "babylonjs";
import { CssCursorStyle, CursorCallbacks, SetCursorStyle } from "../../types";

export default class SceneManager {
  private canvas = document.createElement("canvas");
  private engine = new Engine(this.canvas);
  private scene = new Scene(this.engine);
  private camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 4,
    10,
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
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      this.scene
    );
    ground.enablePointerMoveEvents = true;
    this.onPointerObservable = this.onPointerObservable.bind(this);
    this.scene.onPointerObservable.add(this.onPointerObservable);
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

  // Utils

  // Pointer utils

  private get setCursorStyle(): SetCursorStyle {
    return (style: CssCursorStyle) => {
      if (!this.container || this.container.style.cursor === style) return;
      this.container.style.cursor = style;
    };
  }

  private get defaultCursorCallbacks(): CursorCallbacks {
    return { move: () => {} };
  }

  private onPointerObservable(pointerInfo: PointerInfo) {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERMOVE:
        this.onPointerMove(pointerInfo);
        break;
      default:
    }
  }

  private onPointerMove(pointerInfo: PointerInfo) {
    this.cursorCallbacks.move(pointerInfo);
  }
}
