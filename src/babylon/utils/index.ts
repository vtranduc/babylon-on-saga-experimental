import {
  AbstractMesh,
  Color3,
  LinesMesh,
  Mesh,
  MeshBuilder,
  Nullable,
  Scene,
  Vector3,
  VertexBuffer,
} from "babylonjs";

export function createVertexNormals(
  mesh: AbstractMesh,
  scene: Scene,
  size = 0.1,
  color = "#ff00ff"
): Nullable<LinesMesh> {
  //   const positionArray = mesh.getVerticesData(VertexBuffer.PositionKind);
  //   const normalArray = mesh.getVerticesData(VertexBuffer.NormalKind);

  mesh.updateFacetData();
  //   const indices = mesh.getTotalIndices();
  const positions = mesh.getFacetLocalPositions();
  if (!positions.length) return null;
  const normals = mesh.getFacetLocalNormals();

  console.log("show stuffs", positions.length);

  //   console.log("show: ", indices, positions.length, normals.length);

  const lines: Vector3[][] = [];

  for (let i = 0; i < positions.length; i++) {
    // console.log("show index--> ", i);
    // if (i === 10) break;
    // lines.push([mesh.getFacetPosition(i), new Vector3(0, 2, 0)]);

    // positions[i].add(mesh.position);

    const center = positions[i].add(mesh.position);

    const normal = normals[i].scale(size).add(center);

    lines.push([center, normal]);
  }

  //   for (let i = 0; i < positionArray.length; i += 3) {
  //     const ix = 3 * i;
  //     const iy = ix + 1;
  //     const iz = ix + 2;
  //     const position = new Vector3(
  //       positionArray[ix],
  //       positionArray[iy],
  //       positionArray[iz]
  //     );
  //     const normal = new Vector3(
  //       normalArray[ix],
  //       normalArray[iy],
  //       normalArray[iz]
  //     )
  //       .scale(size)
  //       .add(position);

  //     lines.push([position.add(mesh.position), normal.add(mesh.position)]);
  //   }
  var normalLines = MeshBuilder.CreateLineSystem("", { lines }, scene);
  normalLines.color.copyFrom(Color3.FromHexString(color));
  return normalLines;
}

// export function createVertexNormals2(
//   mesh: Mesh,
//   scene: Scene,
//   size = 0.5,
//   color = "#ff00ff"
// ) {
//   const positionArray = mesh.getVerticesData(VertexBuffer.PositionKind);
//   const normalArray = mesh.getVerticesData(VertexBuffer.NormalKind);

//   const lines: Vector3[][] = [];
//   for (let i = 0; i < positionArray.length; i += 3) {
//     const ix = 3 * i;
//     const iy = ix + 1;
//     const iz = ix + 2;
//     const position = new Vector3(
//       positionArray[ix],
//       positionArray[iy],
//       positionArray[iz]
//     );
//     const normal = new Vector3(
//       normalArray[ix],
//       normalArray[iy],
//       normalArray[iz]
//     )
//       .scale(size)
//       .add(position);

//     lines.push([position.add(mesh.position), normal.add(mesh.position)]);
//   }
//   var normalLines = MeshBuilder.CreateLineSystem("", { lines }, scene);
//   normalLines.color.copyFrom(Color3.FromHexString(color));
//   return normalLines;
// }
