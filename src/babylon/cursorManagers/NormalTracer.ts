import {
  Mesh,
  MeshBuilder,
  Nullable,
  PointerInfo,
  Scene,
  Vector3,
} from "babylonjs";
import {
  LightingDisabledStandardMaterialManager,
  SolidFresnelMaterialManager,
} from "../../lib";
import { CssCursorStyle, SetCursorStyle } from "../../types";
import CursorManager from "./CursorManager";

interface NormalTracerManagerOptions
  extends Partial<NormalTracerMeshProperties> {
  size?: number;
}

interface NormalTracerMeshProperties {
  sphereDiameter: number;
  sphereSegments: number;
  color: string;
  rimColor: string;
  maxRimProjection: number;
  discRadius: number;
  discArc: number;
  alpha: number;
}

export class NormalTracerManager extends CursorManager {
  protected mesh: Mesh;
  protected utils = {
    intersectNormal: new Vector3(),
  };
  private scaleFactor: number;
  private isDragging = false;
  private sphereMaterialManager: SolidFresnelMaterialManager;
  private discMaterialManager: LightingDisabledStandardMaterialManager;
  private distance = 0;

  constructor(
    name: string,
    scene: Scene,
    {
      size = 0.1,
      sphereDiameter = 1,
      sphereSegments = 35,
      color = "#eeeeee",
      rimColor = "#7f7f7f",
      maxRimProjection = 0.6,
      discRadius = 1,
      discArc = 35,
      alpha = 0.8,
    }: NormalTracerManagerOptions = {}
  ) {
    super(name, scene);

    this.scaleFactor = 1 / size;

    const { mesh, sphereMaterialManager, discMaterialManager } =
      this.createMesh({
        sphereDiameter,
        sphereSegments,
        color,
        rimColor,
        maxRimProjection,
        discRadius,
        discArc,
        alpha,
      });

    this.mesh = mesh;
    this.sphereMaterialManager = sphereMaterialManager;
    this.discMaterialManager = discMaterialManager;
  }

  // Mesh Creation

  private createMesh({
    sphereDiameter,
    sphereSegments,
    color,
    rimColor,
    maxRimProjection,
    discRadius,
    discArc,
    alpha,
  }: NormalTracerMeshProperties) {
    const sphere = MeshBuilder.CreateSphere(
      this.name + "Sphere",
      { diameter: sphereDiameter, segments: sphereSegments },
      this.scene
    );

    const sphereMaterialManager = new SolidFresnelMaterialManager(
      this.name + "SphereMaterial",
      this.scene,
      {
        innerColor: color,
        outerColor: rimColor,
        maxRimProjection,
      }
    );

    sphereMaterialManager.apply(sphere);

    const disc = MeshBuilder.CreateDisc(
      this.name + "Disc",
      {
        radius: discRadius,
        arc: discArc,
      },
      this.scene
    );

    disc.lookAt(new Vector3(0, 0, -1));

    const discMaterialManager = new LightingDisabledStandardMaterialManager(
      this.name + "DiscMaterial",
      this.scene,
      { color }
    );

    discMaterialManager.apply(disc);

    discMaterialManager.alpha = alpha;

    sphere.position.z = sphereDiameter / 2;

    const mesh = Mesh.MergeMeshes(
      [sphere, disc],
      undefined,
      undefined,
      undefined,
      undefined,
      true
    );

    if (!mesh) throw new Error("Failed to create normal tracer mesh");

    mesh.name = this.name;

    mesh.renderingGroupId = 1;

    return { mesh, sphereMaterialManager, discMaterialManager };
  }

  // Pointer handlers

  public get getCursorCallbacks() {
    return (setCursorStyle: SetCursorStyle) => {
      this.handleNoHit(setCursorStyle);
      return {
        move: this.getOnCursorUpdateCallback(setCursorStyle),
        wheel: this.getOnCursorUpdateCallback(setCursorStyle),
        dragStart: (pointerInfo: PointerInfo, cameraPosition: Vector3) => {
          this.isDragging = true;
          this.handleNoHit(setCursorStyle, CssCursorStyle.Grabbing);
        },
        dragEnd: (pointerInfo: PointerInfo, cameraPosition: Vector3) => {
          this.isDragging = false;
          this.getOnCursorUpdateCallback(setCursorStyle)(
            pointerInfo,
            cameraPosition
          );
        },
      };
    };
  }

  // Getter and setters for properties

  public get color() {
    return this.discMaterialManager.color;
  }

  public set color(input: string) {
    this.discMaterialManager.color = input;
    this.sphereMaterialManager.innerColor = input;
  }

  public get alpha() {
    return this.discMaterialManager.alpha;
  }

  public set alpha(input: number) {
    this.discMaterialManager.alpha = input;
  }

  public get rimColor() {
    return this.sphereMaterialManager.outerColor;
  }

  public set rimColor(input: string) {
    this.sphereMaterialManager.outerColor = input;
  }

  public get size() {
    return 1 / this.scaleFactor;
  }

  public set size(input: number) {
    this.scaleFactor = 1 / input;
    this.updateScale();
  }

  // Private utils

  private getOnCursorUpdateCallback(setCursorStyle: SetCursorStyle) {
    return (pointerInfo: PointerInfo, cameraPosition: Vector3) => {
      if (this.isDragging) return;
      const hit = this.getHitPoint(pointerInfo);
      if (hit)
        this.handleHit(hit.point, hit.normal, setCursorStyle, cameraPosition);
      else this.handleNoHit(setCursorStyle);
    };
  }

  private getHitPoint(
    pointerInfo: PointerInfo
  ): Nullable<{ point: Vector3; normal: Vector3 }> {
    const pickInfo = pointerInfo.pickInfo;
    if (!pickInfo?.hit) return null;
    if (!pickInfo.pickedPoint) return null;
    const normal = pickInfo.getNormal(true);
    if (!normal) return null;
    return { point: pickInfo.pickedPoint, normal };
  }

  private handleHit(
    pickedPoint: Vector3,
    normal: Vector3,
    setCursorStyle: SetCursorStyle,
    cameraPosition: Vector3
  ) {
    setCursorStyle(CssCursorStyle.None);
    this.mesh.isVisible = true;
    this.mesh.position.copyFrom(pickedPoint);
    this.mesh.lookAt(
      this.utils.intersectNormal.copyFrom(pickedPoint).add(normal)
    );

    this.distance = Vector3.Distance(this.mesh.position, cameraPosition);
    this.updateScale();
  }

  private updateScale() {
    const scale = this.distance / this.scaleFactor;
    this.mesh.scaling.set(scale, scale, scale);
  }

  private handleNoHit(
    setCursorStyle: SetCursorStyle,
    style: CssCursorStyle = CssCursorStyle.NotAllowed
  ) {
    setCursorStyle(style);
    this.mesh.isVisible = false;
  }
}
