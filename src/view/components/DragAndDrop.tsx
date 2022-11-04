import { DragEvent } from "react";
import { useLoadFiles } from "../../customHooks";
import { ContainerProps } from "../../types";

type DragAndDropEvent = DragEvent<HTMLDivElement>;

export function DragAndDrop({ children, style, id }: ContainerProps) {
  const loadFiles = useLoadFiles();

  function onDrop(e: DragAndDropEvent) {
    preventDefaultAndStopPrograpagation(e);
    loadFiles(e.dataTransfer.items);
  }

  function preventDefaultAndStopPrograpagation(e: DragAndDropEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      id={id}
      onDrop={onDrop}
      style={style}
      children={children}
      onDragOver={preventDefaultAndStopPrograpagation}
    />
  );
}
