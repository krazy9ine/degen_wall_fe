import {
  CanvasEditProps,
  CanvasReadonlyProps,
  CanvasLayout,
  ColoredPixelsActionsDict,
  ActionStamped,
  ColorPixelPointers,
  Action,
} from "@/app/types";
import { useEffect, useRef } from "react";
import { PX_HEIGHT, PX_WIDTH, SQUARE_BORDER_COLOR } from "@/app/constants";

export default function CanvasEdit(
  props: CanvasEditProps & CanvasReadonlyProps
) {
  const {
    isEditMode,
    drawColor,
    squareSize,
    canvasReadonly,
    isEraseMode,
    onColorPixel,
    onErasePixel,
    forceUpdate,
    actionStamped,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMouseDown = useRef(false);
  const isInitialRender = useRef(true);
  const canvasEditable = useRef<CanvasLayout>([]);
  const canvasReadonlyCopy = useRef<CanvasLayout>([]);
  const coloredPixelsActionsDict = useRef<ColoredPixelsActionsDict>({});
  const canvasActions = useRef<ColoredPixelsActionsDict[]>([]);
  const canvasActionsUndoed = useRef<ColoredPixelsActionsDict[]>([]);
  const latestAction = useRef<ActionStamped>();

  useEffect(() => {
    if (isEditMode && isInitialRender.current) {
      isInitialRender.current = false;
      canvasEditable.current = JSON.parse(JSON.stringify(canvasReadonly));
      canvasReadonlyCopy.current = JSON.parse(JSON.stringify(canvasReadonly));
    } else if (!isEditMode && !isInitialRender.current) {
      isInitialRender.current = true;
      canvasEditable.current = [];
      canvasReadonlyCopy.current = [];
      coloredPixelsActionsDict.current = {};
      canvasActions.current = [];
      canvasActionsUndoed.current = [];
      latestAction.current = null;
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

    const redrawPixel = (index: number, color: string) => {
      const x = index % PX_WIDTH;
      const y = index / PX_WIDTH;
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

    const addPixelAction = (index: number, color?: string) => {
      const action = coloredPixelsActionsDict.current[index];
      if (action?.newColor !== color) {
        coloredPixelsActionsDict.current = {
          ...coloredPixelsActionsDict.current,
          [index]: {
            prevColor: action?.newColor,
            newColor: color,
          },
        };
        canvasActionsUndoed.current = [];
      }
    };
    const addCanvasAction = () => {
      const action = coloredPixelsActionsDict.current;
      if (Object.keys(action).length) {
        canvasActions.current.push(action);
        canvasActionsUndoed.current = [];
        coloredPixelsActionsDict.current = {};
      }
    };

    const applyCanvasAction = (
      action: ColoredPixelsActionsDict,
      key: keyof ColorPixelPointers
    ) => {
      for (const [indexString, entry] of Object.entries(action)) {
        const color = entry[key];
        const index = Number(indexString);
        if (!color) {
          canvasEditable.current[index].color =
            canvasReadonlyCopy.current[index].color;
          //onErasePixel(index);
        } else {
          canvasEditable.current[index].color = color;
          //onColorPixel(index, color);
        }
        redrawPixel(index, canvasEditable.current[index].color);
      }
    };

    const redoCanvasAction = () => {
      const action = canvasActionsUndoed.current.pop();
      if (action) {
        canvasActions.current.push(action);
        applyCanvasAction(action, "newColor");
      }
    };
    const undoCanvasAction = () => {
      const action = canvasActions.current.pop();
      if (action) {
        canvasActionsUndoed.current.push(action);
        applyCanvasAction(action, "prevColor");
      }
    };

    canvasEditable.current.forEach((square, index) => {
      const row = Math.floor(index / PX_WIDTH);
      const col = index % PX_WIDTH;
      drawPixel(col, row, square.color);
    });

    const handlePixelAction = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / squareSize);
      const y = Math.floor((event.clientY - rect.top) / squareSize);
      if (x >= 0 && x < PX_WIDTH && y >= 0 && y < PX_HEIGHT) {
        const index = y * PX_WIDTH + x;
        if (isEraseMode) {
          const originalColor = canvasReadonlyCopy.current[index].color;
          drawPixel(x, y, originalColor);
          canvasEditable.current[index].color = originalColor;
          addPixelAction(index);
          onErasePixel(index);
        } else {
          drawPixel(x, y, drawColor);
          canvasEditable.current[index].color = drawColor;
          addPixelAction(index, drawColor);
          onColorPixel(index);
        }
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown.current = true;
      handlePixelAction(event);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseDown.current) handlePixelAction(event);
    };

    if (
      actionStamped &&
      actionStamped.timestamp !== latestAction.current?.timestamp
    ) {
      latestAction.current = { ...actionStamped };
      if (latestAction.current.action === Action.Undo) undoCanvasAction();
      else redoCanvasAction();
    }

    const handleMouseUp = () => {
      isMouseDown.current = false;
      forceUpdate();
      addCanvasAction();
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
    actionStamped,
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
