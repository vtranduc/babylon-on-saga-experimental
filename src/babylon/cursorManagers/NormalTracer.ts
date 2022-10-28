import { Mesh, MeshBuilder, PointerInfo, Scene, Vector3 } from "babylonjs";
import {
  LightingDisabledStandardMaterialManager,
  SolidFresnelMaterialManager,
} from "../../lib";
import { CssCursorStyle, SetCursorStyle } from "../../types";
import CursorManager from "./CursorManager";

interface NormalTracerManagerOptions {
  sphereDiameter?: number;
  sphereSegments?: number;
  color?: string;
  rimColor?: string;
  maxRimProjection?: number;
  discRadius?: number;
  discArc?: number;
  alpha?: number;
}

export class NormalTracerManager extends CursorManager {
  protected mesh: Mesh;
  protected utils = {
    intersectNormal: new Vector3(),
  };

  constructor(
    name: string,
    scene: Scene,
    {
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

    this.mesh = this.createMesh({
      sphereDiameter,
      sphereSegments,
      color,
      rimColor,
      maxRimProjection,
      discRadius,
      discArc,
      alpha,
    });
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
  }: Required<NormalTracerManagerOptions>) {
    const sphere = MeshBuilder.CreateSphere(
      this.name + "Sphere",
      { diameter: sphereDiameter, segments: sphereSegments },
      this.scene
    );

    const fresnelMaterial = new SolidFresnelMaterialManager(
      this.name + "SphereMaterial",
      this.scene,
      {
        innerColor: color,
        outerColor: rimColor,
        maxRimProjection,
      }
    );

    fresnelMaterial.apply(sphere);

    const disc = MeshBuilder.CreateDisc(
      this.name + "Disc",
      {
        radius: discRadius,
        arc: discArc,
      },
      this.scene
    );

    disc.lookAt(new Vector3(0, 0, -1));

    const discMaterial = new LightingDisabledStandardMaterialManager(
      this.name + "DiscMaterial",
      this.scene,
      { color }
    );

    discMaterial.apply(disc);

    discMaterial.alpha = alpha;

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

    return mesh;
  }

  // Pointer handlers

  public get getCursorCallbacks() {
    return (setCursorStyle: SetCursorStyle) => {
      this.handleNoHit(setCursorStyle);
      return {
        move: this.getOnCursorMoveCallback(setCursorStyle),
      };
    };
  }

  private getOnCursorMoveCallback(setCursorStyle: SetCursorStyle) {
    return (pointerInfo: PointerInfo) => {
      const pickInfo = pointerInfo.pickInfo;
      if (!pickInfo?.hit) return this.handleNoHit(setCursorStyle);
      if (!pickInfo.pickedPoint) return this.handleNoHit(setCursorStyle);
      const normal = pickInfo.getNormal(true);
      if (!normal) return this.handleNoHit(setCursorStyle);
      this.handleHit(pickInfo.pickedPoint, normal, setCursorStyle);
    };
  }

  private handleHit(
    pickedPoint: Vector3,
    normal: Vector3,
    setCursorStyle: SetCursorStyle
  ) {
    setCursorStyle(CssCursorStyle.Progress);
    this.mesh.isVisible = true;
    this.mesh.position.copyFrom(pickedPoint);
    this.mesh.lookAt(
      this.utils.intersectNormal.copyFrom(pickedPoint).add(normal)
    );
  }

  private handleNoHit(setCursorStyle: SetCursorStyle) {
    setCursorStyle(CssCursorStyle.NotAllowed);
    this.mesh.isVisible = false;
  }
}
