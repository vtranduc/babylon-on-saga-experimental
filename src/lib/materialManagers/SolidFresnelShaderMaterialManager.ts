import { Color3, Scene, ShaderMaterial, Vector3 } from "babylonjs";
import { Shader } from "../../types";
import MaterialManager from "./MaterialManager";

interface SolidFresnelMaterialManagerOptions {
  maxRimProjection?: number;
  innerColor?: string;
  outerColor?: string;
  cameraPosition?: Vector3;
}

export class SolidFresnelMaterialManager extends MaterialManager<ShaderMaterial> {
  private maxRimProjection: number;
  private innerColor3 = new Color3();
  private outerColor3 = new Color3();

  constructor(
    name: string,
    scene: Scene,
    {
      maxRimProjection = 0.6,
      innerColor = "#eeeeee",
      outerColor = "#7f7f7f",
      cameraPosition = new Vector3(),
    }: SolidFresnelMaterialManagerOptions = {}
  ) {
    const material = new ShaderMaterial(
      name,
      scene,
      {
        vertex: Shader.SolidFresnel,
        fragment: Shader.SolidFresnel,
      },
      {
        attributes: ["position", "normal"],
        uniforms: ["worldView", "worldViewProjection"],
      }
    );

    super(material);

    this.maxRimProjection = this.adjustMaxRimProjection(maxRimProjection);
    this.innerColor = innerColor;
    this.outerColor = outerColor;

    material.setFloat("uMaxRimProjection", this.maxRimProjection);
    material.setColor3("uInnerColor", this.innerColor3);
    material.setColor3("uOuterColor", this.outerColor3);
    material.setVector3("uCameraPosition", cameraPosition);

    // material.backFaceCulling = false;
  }

  // Getters and Setters

  public get innerColor() {
    return this.innerColor3.toHexString();
  }

  public set innerColor(string) {
    this.innerColor3.copyFrom(Color3.FromHexString(string));
  }

  public get outerColor() {
    return this.outerColor3.toHexString();
  }

  public set outerColor(string) {
    this.outerColor3.copyFrom(Color3.FromHexString(string));
  }

  // Utils

  private adjustMaxRimProjection(input: number) {
    return Math.max(0, Math.min(input, 1));
  }
}
