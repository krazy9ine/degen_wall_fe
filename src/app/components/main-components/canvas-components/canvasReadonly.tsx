import { useEffect, useRef } from "react";
import { CanvasReadonlyProps, Socials } from "@/app/types";
import { PX_HEIGHT, PX_WIDTH, SQUARE_BORDER_COLOR } from "@/app/constants";

export default function CanvasReadonly(
  props: CanvasReadonlyProps & { onSetSocials: (socials: Socials) => void }
) {
  const {
    squareSize,
    isEditMode,
    canvasReadonly: canvasLayout,
    onSetSocials,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = PX_WIDTH * squareSize;
    canvas.height = PX_HEIGHT * squareSize;

    canvasLayout.forEach((pixel, index) => {
      const row = Math.floor(index / PX_WIDTH);
      const col = index % PX_WIDTH;
      context.fillStyle = `#${pixel.color}`;
      context.fillRect(
        col * squareSize,
        row * squareSize,
        squareSize,
        squareSize
      );
      context.strokeStyle = `#${SQUARE_BORDER_COLOR}`;
      context.strokeRect(
        col * squareSize,
        row * squareSize,
        squareSize,
        squareSize
      );
    });
  }, [canvasLayout, squareSize]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colIndex = Math.floor(x / squareSize);
    const rowIndex = Math.floor(y / squareSize);
    const index = rowIndex * PX_WIDTH + colIndex;
    const pixel = canvasLayout[index];

    if (pixel) {
      onSetSocials(pixel.socials);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity: isEditMode ? 0 : 1, display: "block" }}
      onMouseMove={handleMouseMove}
    />
  );
}
