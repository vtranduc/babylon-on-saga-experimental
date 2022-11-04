import { FilesInputStore } from "babylonjs";
import { useDispatch } from "react-redux";
import { clearAllFiles, loadAllFiles } from "../reducer";

export function useLoadFiles() {
  const dispatch = useDispatch();

  return (itemList: DataTransferItemList) => {
    queueFiles(itemList)
      .then(() => dispatch(loadAllFiles()))
      .catch(() => dispatch(clearAllFiles()));
  };
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
        const name = (path + file.name).toLowerCase();
        FilesInputStore.FilesToLoad[name] = file;
        resolve();
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
