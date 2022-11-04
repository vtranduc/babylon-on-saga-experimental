interface PathAndName {
  path: string;
  name: string;
}

export function getPathAndName(pathNameCombined: string): PathAndName {
  const lastSlash = pathNameCombined.lastIndexOf("/");
  if (lastSlash === -1)
    return {
      path: "",
      name: pathNameCombined,
    };
  return {
    path: pathNameCombined.substring(0, lastSlash + 1),
    name: pathNameCombined.substring(lastSlash + 1),
  };
}
