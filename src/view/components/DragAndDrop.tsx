import { DragEvent } from "react";
import { useDispatch } from "react-redux";
import { loadBlob } from "../../reducer";
import { Asset3DEXT, ContainerProps } from "../../types";
import { getEXT } from "../../utils/getEXT";

type DragAndDropEvent = DragEvent<HTMLDivElement>;

export function DragAndDrop({ children, style, id }: ContainerProps) {
  const dispatch = useDispatch();

  function onDrop(e: DragAndDropEvent) {
    preventDefaultAndStopPrograpagation(e);
    const file = e.dataTransfer.files[0];
    const ext = getEXT(file.name);
    if (ext !== Asset3DEXT.GLB) return;
    const blob = window.URL.createObjectURL(file);
    dispatch(loadBlob({ blob, ext }));
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
