/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CanvasLayout,
  CanvasWrapperProps,
  MetadataAccountParsed,
  Socials,
} from "@/app/types";
import CanvasReadonly from "./canvasReadonly";
import CanvasEdit from "./canvasEdit";
import { memo, useContext, useEffect, useRef, useState } from "react";
import {
  getDefaultCanvas,
  getUpdatedCanvas,
  initAndGetCanvas,
} from "./canvas-util";
import { PX_HEIGHT, PX_WIDTH, RPC_URL_KEY } from "@/app/constants";
import { EventListenerContext } from "@/app/context/EventListenerProvider";
import useWindowDimensions from "@/app/hooks/useWindowDimensions";

const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 12;

const CanvasEditMemo = memo(CanvasEdit);

export default function CanvasWrapper(
  props: CanvasWrapperProps & { onSetSocials: (socials: Socials) => void }
) {
  const {
    isEditMode,
    drawColor,
    isEraseMode,
    onColorPixel,
    onErasePixel,
    onSetSocials,
    forceUpdate,
  } = props;
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>(
    getDefaultCanvas()
  );
  const isInitialRender = useRef(true);
  const setEventHandler = useContext(EventListenerContext);

  const { height, width } = useWindowDimensions();

  const squareSize = Math.max(
    SQUARE_MIN_SIZE,
    Math.min(
      Math.floor((width * CANVAS_DISPLAY_RATIO) / PX_WIDTH),
      Math.floor((height * CANVAS_DISPLAY_RATIO) / PX_HEIGHT)
    )
  );

  useEffect(() => {
    const updateCanvas = (event: MetadataAccountParsed) => {
      const [newCanvas] = getUpdatedCanvas(event);
      setCanvasLayout([...newCanvas]);
    };

    const onInitAndGetCanvas = async () => {
      const endpoint = localStorage.getItem(RPC_URL_KEY) || "";
      const initialCanvas = await initAndGetCanvas(endpoint);
      setCanvasLayout(initialCanvas);
    };

    if (isInitialRender.current) {
      isInitialRender.current = false;
      setEventHandler(updateCanvas);
      onInitAndGetCanvas();
    }
  }, [canvasLayout, setEventHandler]);
  return (
    <div id="canvas wrapper" className="flex">
      <CanvasReadonly
        squareSize={squareSize}
        isEditMode={isEditMode}
        canvasReadonly={canvasLayout}
        onSetSocials={onSetSocials}
      ></CanvasReadonly>
      <CanvasEditMemo
        isEditMode={isEditMode}
        drawColor={drawColor}
        isEraseMode={isEraseMode}
        onColorPixel={onColorPixel}
        onErasePixel={onErasePixel}
        forceUpdate={forceUpdate}
        squareSize={squareSize}
        canvasReadonly={canvasLayout}
      ></CanvasEditMemo>
    </div>
  );
}
