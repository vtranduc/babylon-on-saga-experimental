import { Color3, Scene, StandardMaterial } from "babylonjs";
import MaterialManager from "./MaterialManager";

interface LightingDisabledStandardMaterialManagerOptions {
  color?: string;
}

export class LightingDisabledStandardMaterialManager extends MaterialManager<StandardMaterial> {
  constructor(
    name: string,
    scene: Scene,
    options: LightingDisabledStandardMaterialManagerOptions = {}
  ) {
    super(new StandardMaterial(name, scene));
    this.material.disableLighting = true;
    this.material.ambientColor = Color3.Black();
    if (options.color)
      this.material.emissiveColor.copyFrom(Color3.FromHexString(options.color));
  }

  // Getters and Setters

  public get color() {
    return this.material.emissiveColor.toHexString();
  }

  public set color(input: string) {
    this.material.emissiveColor.copyFrom(Color3.FromHexString(input));
  }
}
