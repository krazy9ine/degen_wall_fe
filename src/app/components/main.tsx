import { useEffect, useRef, useState } from "react";
import { CanvasWrapper } from "./canvas";
import { ColorPicker } from "primereact/colorpicker";
import { Backdrop } from "@mui/material";

export default function Main() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [drawColor, setDrawColor] = useState("ffffff");
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const menuRef = useRef(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          //@ts-ignore
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

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
    if (isEditMode) setIsEditMode(false);
    if (isEraseMode) setIsEraseMode(false);
  };

  const onSetDrawColor = (color: string) => {
    if (color) setDrawColor(color);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      //@ts-ignore
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <main>
      <div id="menu" className="flex justify-between">
        <div id="menu-leftside" className="flex gap-2">
          <button disabled={isEditMode && !isEraseMode} onClick={enterEditMode}>
            Pencil
          </button>
          <div
            className="w-6 h-6 border-white border-2 rounded-full overflow-hidden"
            style={{ opacity: isEditMode ? 1 : 0 }}
          >
            <ColorPicker
              format="hex"
              value={drawColor}
              onChange={(e) => onSetDrawColor(e.value as string)}
              disabled={!isEditMode}
            />
          </div>
          <button
            disabled={!isEditMode || isEraseMode}
            style={{ opacity: isEditMode ? 1 : 0 }}
            onClick={enableEraseMode}
          >
            Erase
          </button>
          <button
            disabled={!isEditMode}
            style={{ opacity: isEditMode ? 1 : 0 }}
            onClick={handleOpen}
          >
            Upload
          </button>
          <button
            disabled={!isEditMode}
            style={{ opacity: isEditMode ? 1 : 0 }}
            onClick={exitEditMode}
          >
            Exit
          </button>
        </div>
        <div id="menu-rightside"></div>
      </div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <div ref={menuRef}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </Backdrop>
      <CanvasWrapper
        isEditMode={isEditMode}
        drawColor={drawColor}
        isEraseMode={isEraseMode}
      ></CanvasWrapper>
    </main>
  );
}
