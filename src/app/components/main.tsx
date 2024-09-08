import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasWrapper, SocialsSection } from "./main-components";
import { ColorPicker } from "primereact/colorpicker";
import { Backdrop } from "@mui/material";
import { CanvasEditProps, ColoredPixelsDict, Socials } from "../types";
import { ERASE_PIXELS_CODE, MAX_DATA_SIZE, PX_SIZE } from "../constants";

const MAX_PX_NR = MAX_DATA_SIZE / PX_SIZE;
const MAX_JITO_TX_NR = 5;
const DEFAULT_COLOR = "ffffff";
const DEFAULT_COLOR_KEY = "color";

export default function Main() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [drawColor, setDrawColor] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem(DEFAULT_COLOR_KEY) || DEFAULT_COLOR
      : DEFAULT_COLOR
  );
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [update, setUpdate] = useState(false);
  const menuRef = useRef(null);
  const coloredPixelsDict = useRef<ColoredPixelsDict>({});
  const changesPending = useRef(false);
  const [socials, setSocials] = useState<Socials>();

  const onColorPixel = useCallback(
    (index: number) => {
      coloredPixelsDict.current = {
        ...coloredPixelsDict.current,
        [index]: drawColor,
      };
      changesPending.current = true;
    },
    [drawColor]
  );
  const onErasePixel = useCallback((index: number) => {
    if (index === ERASE_PIXELS_CODE)
      // erase all
      coloredPixelsDict.current = {};
    else delete coloredPixelsDict.current[index];
    changesPending.current = true;
  }, []);
  const onSetSocials = useCallback((socials: Socials) => {
    setSocials(socials);
  }, []);
  const forceUpdate = useCallback(() => {
    if (changesPending.current) {
      setUpdate((prevValue) => !prevValue);
      changesPending.current = false;
    }
  }, []);

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
    onErasePixel(ERASE_PIXELS_CODE);
  };

  const onSetDrawColor = (color: string) => {
    if (color) {
      setDrawColor(color);
      localStorage.setItem(DEFAULT_COLOR_KEY, color);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const canvasEditProps: CanvasEditProps = {
    drawColor,
    forceUpdate,
    isEditMode,
    isEraseMode,
    onColorPixel,
    onErasePixel,
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
      <div id="menu" className="flex mt-2">
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
        <div id="menu-rightside">
          <span
            style={{
              color: (() => {
                const pixelCount = Object.keys(
                  coloredPixelsDict.current
                ).length;
                return pixelCount <= 0
                  ? "white"
                  : pixelCount <= MAX_PX_NR
                  ? "green"
                  : pixelCount <= MAX_PX_NR * MAX_JITO_TX_NR
                  ? "orange"
                  : "red";
              })(),
            }}
          >
            {(() => {
              const pixelCount = Object.keys(coloredPixelsDict.current).length;
              return pixelCount <= 0
                ? ""
                : `${pixelCount}/${
                    MAX_PX_NR * (pixelCount <= MAX_PX_NR ? 1 : MAX_JITO_TX_NR)
                  }`;
            })()}
          </span>
        </div>
      </div>
      <CanvasWrapper
        {...canvasEditProps}
        onSetSocials={onSetSocials}
      ></CanvasWrapper>
      <SocialsSection {...socials} isEditMode={isEditMode}></SocialsSection>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <div ref={menuRef}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </Backdrop>
    </main>
  );
}
