import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasWrapper, MenuSection, SocialsSection } from "./main-components";
import {
  Action,
  ActionStamped,
  CanvasEditProps,
  ColoredPixelsDict,
  MenuSectionProps,
  PixelArray,
  Socials,
  UploadPopupProps,
} from "../types";
import { ERASE_PIXELS_CODE } from "../constants";
import UploadPopup from "./main-components/uploadPopup";

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
  const [pixelArray, setPixelArray] = useState<PixelArray>([]);
  const [update, setUpdate] = useState(false);
  const menuRef = useRef(null);
  const coloredPixelsDict = useRef<ColoredPixelsDict>({});
  const changesPending = useRef(false);
  const [socials, setSocials] = useState<Socials>();
  const [actionStamped, setActionStamped] = useState<ActionStamped>(null);
  const undoCount = useRef(0);
  const redoCount = useRef(0);
  const onSetActionStamped = (action: Action) => {
    if (action === Action.Undo) {
      redoCount.current++;
      undoCount.current--;
    } else {
      undoCount.current++;
      redoCount.current--;
    }
    setActionStamped({ action, timestamp: Date.now() });
  };

  const clearActionStamped = () => {
    setActionStamped(null);
  };

  const onColorPixel = useCallback(
    (index: number, color = drawColor) => {
      coloredPixelsDict.current = {
        ...coloredPixelsDict.current,
        [index]: color,
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
  const forceUpdate = useCallback((isNewAction?: boolean) => {
    if (changesPending.current) {
      setUpdate((prevValue) => !prevValue);
      changesPending.current = false;
      if (isNewAction) {
        undoCount.current++;
        redoCount.current = 0;
      }
    }
  }, []);

  const onSaveImage = (pixelArray: PixelArray) => {
    setPixelArray(pixelArray);
    handleClose();
  };

  const onClearImage = () => {
    setPixelArray([]);
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
    clearActionStamped();
    undoCount.current = 0;
    redoCount.current = 0;
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
    actionStamped,
    pixelArray,
    onClearImage,
  };

  const menuSectionProps: MenuSectionProps = {
    isEditMode,
    isEraseMode,
    drawColor,
    undoCount: undoCount.current,
    redoCount: redoCount.current,
    coloredPixelsCount: Object.keys(coloredPixelsDict.current).length,
    onSetActionStamped,
    onSetDrawColor,
    enterEditMode,
    enableEraseMode,
    exitEditMode,
    handleOpen,
  };
  const uploadPopupProps: UploadPopupProps = {
    open,
    onClose: handleClose,
    onSaveImage,
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
      <div id="menu-canvas-wrapper" className="inline-block">
        <MenuSection {...menuSectionProps}></MenuSection>
        <CanvasWrapper
          {...canvasEditProps}
          onSetSocials={onSetSocials}
        ></CanvasWrapper>
      </div>
      <SocialsSection {...socials} isEditMode={isEditMode}></SocialsSection>
      <UploadPopup {...uploadPopupProps}></UploadPopup>
    </main>
  );
}
