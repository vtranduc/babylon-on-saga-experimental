import { Color3, Scene, ShaderMaterial, Vector2, Vector3 } from "babylonjs";
import { Shader } from "../../types";
import MaterialManager from "./MaterialManager";

interface InfiniteGridMaterialManagerOptions {
  majorColor?: string;
  minorColor?: string;
  fadeStart?: number;
  distance?: number;
  minorSpacing?: number;
  majorSpacing?: number;
  originSpacing?: number;
  originCircleInnerRadius?: number;
  originOuterCircleRadius?: number;
  xAxisColor?: string;
  yAxisColor?: string;
}

/**
 * For an infinite grid material to work correct to scale, a plane mesh centered
 * at (0, 0, 0) with the dimension of 2 x 2 must be used.
 */

export class InfiniteGridMaterialManager extends MaterialManager<ShaderMaterial> {
  private majorColor = new Color3();
  private minorColor = new Color3();
  private fadeRange = new Vector2();
  private spacing = new Vector2();
  private originParams = new Vector3();
  private xColor = new Color3();
  private yColor = new Color3();

  constructor(
    name: string,
    scene: Scene,
    cameraPosition: Vector3,
    {
      minorColor = "#505050",
      majorColor = "#bbbbbb",
      fadeStart = 50,
      distance = 100,
      minorSpacing = 0.1,
      majorSpacing = 1,
      originSpacing = 0.3,
      originCircleInnerRadius = 0.1,
      originOuterCircleRadius = 0.2,
      xAxisColor = "#0000ff",
      yAxisColor = "#ff0000",
    }: InfiniteGridMaterialManagerOptions = {}
  ) {
    const material = new ShaderMaterial(
      name,
      scene,
      {
        vertex: Shader.InfiniteGrid,
        fragment: Shader.InfiniteGrid,
      },
      {
        attributes: ["position"],
        uniforms: ["worldViewProjection"],
        needAlphaBlending: true,
      }
    );

    material.backFaceCulling = false;

    super(material);

    this.majorColor.copyFrom(Color3.FromHexString(majorColor));
    this.minorColor.copyFrom(Color3.FromHexString(minorColor));
    this.xColor.copyFrom(Color3.FromHexString(xAxisColor));
    this.yColor.copyFrom(Color3.FromHexString(yAxisColor));
    this.fadeRange.set(fadeStart, distance);
    this.spacing.set(minorSpacing, majorSpacing);
    this.originParams.set(
      originCircleInnerRadius,
      originOuterCircleRadius,
      originSpacing
    );

    material.setVector3("uCameraPosition", cameraPosition);
    material.setColor3("uMajorColor", this.majorColor);
    material.setColor3("uMinorColor", this.minorColor);
    material.setColor3("uXAxisColor", this.xColor);
    material.setColor3("uYAxisColor", this.yColor);
    material.setVector2("uFadeRange", this.fadeRange);
    material.setVector2("uSpacing", this.spacing);
    material.setVector3("uOriginParams", this.originParams);
  }
}
