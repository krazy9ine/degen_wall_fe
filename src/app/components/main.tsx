import { useEffect, useRef, useState } from "react";
import { CanvasWrapper, SocialsSection } from "./main-components";
import { ColorPicker } from "primereact/colorpicker";
import { Backdrop } from "@mui/material";
import { ColoredPixelsDict, Socials } from "../types";
import { ERASE_PIXELS_CODE } from "../constants";
import AnchorInterface from "../web3/program";
import { Connection } from "@solana/web3.js";
import useWindowDimensions from "../hooks/useWindowDimensions";

const anchorInterface = new AnchorInterface(null as unknown as Connection);
const { MAX_DATA_SIZE, PX_SIZE, PX_HEIGHT, PX_WIDTH } = anchorInterface;
const MAX_PX_NR = MAX_DATA_SIZE / PX_SIZE;
const MAX_JITO_TX_NR = 5;
const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 1;
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
  const menuRef = useRef(null);
  const [coloredPixelsDict, setColoredPixelsDict] = useState<ColoredPixelsDict>(
    {}
  );

  const { height, width } = useWindowDimensions();

  const squareSize = Math.max(
    SQUARE_MIN_SIZE,
    Math.min(
      Math.floor((width * CANVAS_DISPLAY_RATIO) / PX_WIDTH),
      Math.floor((height * CANVAS_DISPLAY_RATIO) / PX_HEIGHT)
    )
  );

  const [socials, setSocials] = useState<Socials>();

  const onSetSocials = (socials: Socials) => {
    setSocials(socials);
  };

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

  const onColorPixel = (index: number) => {
    setColoredPixelsDict((prevValues) => {
      return { ...prevValues, [index]: drawColor };
    });
  };

  const onErasePixel = (index: number) => {
    setColoredPixelsDict((prevValues) => {
      if (index === ERASE_PIXELS_CODE)
        // erase all
        return {};
      const updatedValues = { ...prevValues };
      delete updatedValues[index];
      return updatedValues;
    });
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
      <div
        id="menu"
        className="flex"
        style={{ gap: `${squareSize * PX_WIDTH - 20}px` }}
      >
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
                const pixelCount = Object.keys(coloredPixelsDict).length;
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
              const pixelCount = Object.keys(coloredPixelsDict).length;
              return pixelCount <= 0
                ? ""
                : `${pixelCount}/${
                    MAX_PX_NR * pixelCount > MAX_PX_NR ? 1 : MAX_JITO_TX_NR
                  }`;
            })()}
          </span>
        </div>
      </div>
      <CanvasWrapper
        isEditMode={isEditMode}
        drawColor={drawColor}
        isEraseMode={isEraseMode}
        squareSize={squareSize}
        pxWidth={PX_WIDTH}
        pxHeight={PX_HEIGHT}
        onColorPixel={onColorPixel}
        onErasePixel={onErasePixel}
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
