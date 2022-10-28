import { Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import {
  LightingDisabledStandardMaterialManager,
  SolidFresnelMaterialManager,
} from "../../lib";
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

    disc.lookAt(new Vector3(0, -1, 0));

    const discMaterial = new LightingDisabledStandardMaterialManager(
      this.name + "DiscMaterial",
      this.scene,
      { color }
    );

    discMaterial.apply(disc);

    discMaterial.alpha = alpha;

    sphere.position.y = sphereDiameter / 2;

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
}
