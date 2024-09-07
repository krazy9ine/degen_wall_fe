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
import { RPC_URL_KEY } from "@/app/constants";
import { EventListenerContext } from "@/app/context/EventListenerProvider";

export default function CanvasWrapper(
  props: CanvasWrapperProps & { onSetSocials: (socials: Socials) => void }
) {
  const {
    isEditMode,
    drawColor,
    isEraseMode,
    squareSize,
    pxHeight,
    pxWidth,
    onColorPixel,
    onErasePixel,
    onSetSocials,
  } = props;
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>(
    getDefaultCanvas()
  );
  const isInitialRender = useRef(true);
  const setEventHandler = useContext(EventListenerContext);

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
        pxHeight={pxHeight}
        pxWidth={pxWidth}
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
        pxHeight={pxHeight}
        pxWidth={pxWidth}
        canvasLayout={canvasLayout}
      ></CanvasEdit>
    </div>
  );
}
