/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CanvasLayout,
  CanvasWrapperProps,
  MetadataAccountParsed,
  Socials,
} from "@/app/types";
import CanvasView from "./canvasView";
import CanvasEdit from "./canvasEdit";
import { useContext, useEffect, useRef, useState } from "react";
import {
  getDefaultCanvas,
  getUpdatedCanvas,
  initAndGetCanvas,
} from "./canvas-util";
import { PX_HEIGHT, PX_WIDTH, RPC_URL_KEY } from "@/app/constants";
import { EventListenerContext } from "@/app/context/EventListenerProvider";
import useWindowDimensions from "@/app/hooks/useWindowDimensions";

const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 1;

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
      <CanvasView
        squareSize={squareSize}
        isEditMode={isEditMode}
        canvasLayout={canvasLayout}
        onSetSocials={onSetSocials}
      ></CanvasView>
      <CanvasEdit
        isEditMode={isEditMode}
        drawColor={drawColor}
        isEraseMode={isEraseMode}
        onColorPixel={onColorPixel}
        onErasePixel={onErasePixel}
        squareSize={squareSize}
        canvasLayout={canvasLayout}
      ></CanvasEdit>
    </div>
  );
}
