"use client";

import { CanvasProps, Socials } from "@/app/types";
import SquareReadonly from "./squareReadonly";

export default function CanvasView(
  props: CanvasProps & { onSetSocials: (socials: Socials) => void }
) {
  const {
    squareSize,
    pxHeight,
    pxWidth,
    isEditMode,
    canvasLayout,
    onSetSocials,
  } = props;
  return (
    <div
      id="canvas-view"
      className="flex"
      style={{ opacity: isEditMode ? 0 : 1 }}
    >
      <div id="canvas-readonly">
        {Array.from({ length: pxHeight }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              display: "flex",
            }}
          >
            {Array.from({ length: pxWidth }).map((_, colIndex) => {
              const index = rowIndex * pxWidth + colIndex;
              const pixel = canvasLayout[index];
              return (
                <SquareReadonly
                  key={`${rowIndex}-${colIndex}`}
                  size={squareSize}
                  metadataItem={pixel}
                  onSetSocials={onSetSocials}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
