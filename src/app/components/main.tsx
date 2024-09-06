import { useState } from "react";
import { CanvasWrapper } from "./canvas";
import { DrawItem } from "../types";

export default function Main() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [drawItems, setDrawItems] = useState<DrawItem[]>([]);
  const [drawColor, setDrawColor] = useState("ffffff");
  const enterEditMode = () => {
    if (!isEditMode) setIsEditMode(true);
  };

  const exitEditMode = () => {
    if (isEditMode) {
      setDrawItems([]);
      setIsEditMode(false);
    }
  };

  const addDrawItem = (drawItem: DrawItem) => {
    setDrawItems((prevItems) => [...prevItems, drawItem]);
  };

  const removeLastDrawItem = () => {
    setDrawItems((prevItems) => prevItems.slice(0, -1));
  };

  return (
    <main>
      <div className="flex gap-2">
        <button disabled={isEditMode} onClick={enterEditMode}>
          Pencil
        </button>
        <span>Color</span>
        <button>PickColor</button>
        <button>Undo</button>
        <button>Upload</button>
        <button disabled={!isEditMode} onClick={exitEditMode}>
          Exit
        </button>
      </div>
      <CanvasWrapper
        isEditMode={isEditMode}
        addDrawItem={addDrawItem}
        drawItems={drawItems}
        drawColor={drawColor}
      ></CanvasWrapper>
    </main>
  );
}
