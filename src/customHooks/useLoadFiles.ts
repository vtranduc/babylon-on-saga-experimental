import { FilesInputStore } from "babylonjs";
import { loadAsync } from "jszip";
import { useDispatch } from "react-redux";
import { clearAllFiles, loadAllFiles } from "../reducer";
import { CompressedDirectoryEXT } from "../types";
import { getEXT, getPathAndName } from "../utils";

export function useLoadFiles() {
  const dispatch = useDispatch();

  return (itemList: DataTransferItemList) =>
    queueFiles(itemList)
      .then(() => dispatch(loadAllFiles()))
      .catch(() => dispatch(clearAllFiles()));
}

function queueFiles(itemList: DataTransferItemList) {
  const entries: FileSystemEntry[] = [];
  for (let i = 0; i < itemList.length; i++) {
    const entry = itemList[i].webkitGetAsEntry();
    if (entry) entries.push(entry);
  }
  return Promise.all(entries.map((entry) => queueFileTree(entry)));
}

function queueFileTree(entry: FileSystemEntry, path = ""): Promise<void> {
  return new Promise((resolve, reject) => {
    const errorCallback = (error?: DOMException) =>
      reject(`Failed to load ${entry.name}${error ? `: ${error}` : ""}`);
    if (entry.isFile) {
      (entry as FileSystemFileEntry).file((file) => {
        if (getEXT(file.name) === CompressedDirectoryEXT.ZIP)
          queueCompressedDirectory(file, path)
            .then(() => resolve())
            .catch(errorCallback);
        else {
          appendFileToLoad(path + file.name, file);
          resolve();
        }
      }, errorCallback);
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      reader.readEntries(async (entries) => {
        for (let i = 0; i < entries.length; i++)
          await queueFileTree(entries[i], path + entry.name + "/");
        resolve();
      }, errorCallback);
    } else errorCallback();
  });
}

async function queueCompressedDirectory(zipFile: File, path: string) {
  const unzipped = await loadAsync(zipFile);
  const entries = Object.entries(unzipped.files);
  for (let [entryPath, jsZipObject] of entries) {
    if (jsZipObject.dir) continue;
    const { name, path: pathWithinZip } = getPathAndName(entryPath);
    const blob = await jsZipObject.async("blob");
    const file = new File([blob], name);
    const fullPath = path + zipFile.name + "/" + pathWithinZip;
    if (getEXT(name) === CompressedDirectoryEXT.ZIP)
      await queueCompressedDirectory(file, fullPath);
    else appendFileToLoad(fullPath + name, file);
  }
}

function appendFileToLoad(path: string, file: File) {
  FilesInputStore.FilesToLoad[path.toLowerCase()] = file;
}
