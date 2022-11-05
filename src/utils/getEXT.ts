import { ImageEXT, Asset3DEXT, EXT, CompressedDirectoryEXT } from "../types";

export function getEXT(name: string): EXT | null {
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return null;
  const ext = name.substring(lastDot + 1).toLowerCase();
  switch (ext) {
    case "png":
      return ImageEXT.PNG;
    case "jpg":
      return ImageEXT.JPG;
    case "jpeg":
      return ImageEXT.JPEG;
    case "webp":
      return ImageEXT.WEBP;
    case "fbx":
      return Asset3DEXT.FBX;
    case "obj":
      return Asset3DEXT.OBJ;
    case "glb":
      return Asset3DEXT.GLB;
    case "gltf":
      return Asset3DEXT.GLTF;
    case "zip":
      return CompressedDirectoryEXT.ZIP;
    default:
      return null;
  }
}
