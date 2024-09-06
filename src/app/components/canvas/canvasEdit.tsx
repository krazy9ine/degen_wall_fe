import { CanvasLayout, CanvasProps, CanvasWrapperProps } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "@/app/hooks/useWindowDimensions";
import SquareEdit from "./squareEdit";

export default function CanvasEdit(props: CanvasWrapperProps & CanvasProps) {
  const {
    isEditMode,
    drawColor,
    displayRatio,
    pxHeight,
    pxWidth,
    squareMinSize,
    canvasLayout,
    isEraseMode,
  } = props;
  const [canvas, setCanvas] = useState<CanvasLayout>(canvasLayout);
  const originalCanvas = useRef<CanvasLayout>([]);
  const { height, width } = useWindowDimensions();
  const isMouseDown = useRef(false);
  const isInitialRender = useRef(true);

  const squareSize = Math.max(
    squareMinSize,
    Math.min(
      Math.floor((width * displayRatio) / pxWidth),
      Math.floor((height * displayRatio) / pxHeight)
    )
  );
  const onSetCanvas = (canvas: CanvasLayout) => {
    setCanvas(canvas);
  };

  useEffect(() => {
    if (isEditMode && isInitialRender.current) {
      isInitialRender.current = false;
      onSetCanvas(canvasLayout);
      originalCanvas.current = canvasLayout;
    } else if (!isEditMode && !isInitialRender.current) {
      isInitialRender.current = true;
      onSetCanvas(canvasLayout);
      originalCanvas.current = [];
    }
  }, [isEditMode, canvasLayout]);

  useEffect(() => {
    const handleMouseDown = () => {
      isMouseDown.current = true;
    };
    const handleMouseUp = () => {
      isMouseDown.current = false;
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return (
    <div
      id="canvas-view"
      className="flex absolute"
      style={{ opacity: isEditMode ? 1 : 0, zIndex: isEditMode ? 1 : -1 }}
    >
      <div id="canvas-edit">
        {Array.from({ length: pxHeight }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              display: "flex",
            }}
          >
            {Array.from({ length: pxWidth }).map((_, colIndex) => {
              const index = rowIndex * pxWidth + colIndex;
              const pixel = canvas[index];
              const onSetSquareColor = () => {
                if (isMouseDown.current) {
                  const canvasCopy = JSON.parse(
                    JSON.stringify(canvas)
                  ) as CanvasLayout;
                  canvasCopy[index].color = isEraseMode
                    ? originalCanvas.current[index].color
                    : drawColor;
                  onSetCanvas(canvasCopy);
                }
              };
              return (
                <SquareEdit
                  key={`${rowIndex}-${colIndex}`}
                  size={squareSize}
                  metadataItem={pixel}
                  onSetSquareColor={onSetSquareColor}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
