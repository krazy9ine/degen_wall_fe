import { CanvasWrapperProps, CanvasProps, CanvasLayout } from "@/app/types";
import { useEffect, useRef } from "react";
import { PX_HEIGHT, PX_WIDTH, SQUARE_BORDER_COLOR } from "@/app/constants";

export default function CanvasEdit(props: CanvasWrapperProps & CanvasProps) {
  const {
    isEditMode,
    drawColor,
    squareSize,
    canvasReadonly,
    isEraseMode,
    onColorPixel,
    onErasePixel,
    forceUpdate,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef(false);
  const isInitialRender = useRef(true);
  const canvasEditable = useRef<CanvasLayout>([]);
  const canvasReadonlyCopy = useRef<CanvasLayout>([]);

  useEffect(() => {
    if (isEditMode && isInitialRender.current) {
      isInitialRender.current = false;
      canvasEditable.current = JSON.parse(JSON.stringify(canvasReadonly));
      canvasReadonlyCopy.current = JSON.parse(JSON.stringify(canvasReadonly));
    } else if (!isEditMode && !isInitialRender.current) {
      isInitialRender.current = true;
      canvasEditable.current = [];
      canvasReadonlyCopy.current = [];
    }
  }, [isEditMode, canvasReadonly]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = PX_WIDTH * squareSize;
    canvas.height = PX_HEIGHT * squareSize;

    const drawPixel = (x: number, y: number, color: string) => {
      context.fillStyle = `#${color}`;
      context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
      context.strokeStyle = `#${SQUARE_BORDER_COLOR}`;
      context.lineWidth = 1;
      context.strokeRect(
        x * squareSize,
        y * squareSize,
        squareSize,
        squareSize
      );
    };

    canvasEditable.current.forEach((square, index) => {
      const row = Math.floor(index / PX_WIDTH);
      const col = index % PX_WIDTH;
      drawPixel(col, row, square.color);
    });

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown.current = true;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / squareSize);
      const y = Math.floor((event.clientY - rect.top) / squareSize);
      if (x >= 0 && x < PX_WIDTH && y >= 0 && y < PX_HEIGHT) {
        const index = y * PX_WIDTH + x;
        if (isEraseMode) {
          const originalColor = canvasReadonlyCopy.current[index].color;
          drawPixel(x, y, originalColor);
          canvasEditable.current[index].color = originalColor;
          onErasePixel(index);
        } else {
          drawPixel(x, y, drawColor);
          canvasEditable.current[index].color = drawColor;
          onColorPixel(index);
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseDown.current) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / squareSize);
        const y = Math.floor((event.clientY - rect.top) / squareSize);
        if (x >= 0 && x < PX_WIDTH && y >= 0 && y < PX_HEIGHT) {
          const index = y * PX_WIDTH + x;
          if (isEraseMode) {
            const originalColor = canvasReadonlyCopy.current[index].color;
            drawPixel(x, y, originalColor);
            canvasEditable.current[index].color = originalColor;
            onErasePixel(index);
          } else {
            drawPixel(x, y, drawColor);
            canvasEditable.current[index].color = drawColor;
            onColorPixel(index);
          }
        }
      }
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      forceUpdate();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isEditMode,
    drawColor,
    isEraseMode,
    squareSize,
    onErasePixel,
    onColorPixel,
    forceUpdate,
  ]);

  return (
    <div
      id="canvas-view"
      className="flex absolute"
      style={{ opacity: isEditMode ? 1 : 0, zIndex: isEditMode ? 1 : -1 }}
    >
      <canvas ref={canvasRef} onDragStart={(e) => e.preventDefault()} />
    </div>
  );
}
