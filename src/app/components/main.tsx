import { useState } from "react";
import { CanvasWrapper } from "./canvas";

export default function Main() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [drawColor, setDrawColor] = useState("ffffff");

  const enableEraseMode = () => {
    setIsEraseMode(true);
  };

  const enterEditMode = () => {
    if (!isEditMode) {
      setIsEditMode(true);
    }
    setIsEraseMode(false);
  };

  const exitEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
    }
    setIsEraseMode(false);
  };

  return (
    <main>
      <div className="flex gap-2">
        <button disabled={isEditMode && !isEraseMode} onClick={enterEditMode}>
          Pencil
        </button>
        <span>Color</span>
        <button>PickColor</button>
        <button disabled={!isEditMode || isEraseMode} onClick={enableEraseMode}>
          Erase
        </button>
        <button>Upload</button>
        <button disabled={!isEditMode} onClick={exitEditMode}>
          Exit
        </button>
      </div>
      <CanvasWrapper
        isEditMode={isEditMode}
        drawColor={drawColor}
        isEraseMode={isEraseMode}
      ></CanvasWrapper>
    </main>
  );
}
