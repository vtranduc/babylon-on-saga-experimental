import {
  Engine,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  MeshBuilder,
  Vector3,
} from "babylonjs";

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

  constructor() {
    this.canvas.style.width = this.canvas.style.height = "100%";
    this.camera.attachControl();
    this.engine.runRenderLoop(() => this.scene.render());

    new DirectionalLight("light", new Vector3(0, -1, 0), this.scene);

    MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, this.scene);
  }

  // Getters and Setters

  public get renderScene() {
    return this.scene;
  }

  // Public methods

  public setCanvasContainer(element: HTMLElement) {
    if (this.container) {
      this.container.removeChild(this.canvas);
      this.resizeObserver.disconnect();
    }
    this.container = element;
    this.resizeObserver.observe(this.container);
    this.container.appendChild(this.canvas);
    this.engine.resize();
  }
}
