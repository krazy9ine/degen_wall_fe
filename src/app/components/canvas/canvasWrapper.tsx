/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CanvasLayout,
  CanvasWrapperProps,
  MetadataAccountParsed,
} from "@/app/types";

import AnchorInterface from "@/app/web3/program";
import { Connection } from "@solana/web3.js";
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

const anchorInterface = new AnchorInterface(null as unknown as Connection);
const { PX_HEIGHT, PX_WIDTH } = anchorInterface;
const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 1;

export default function CanvasWrapper(props: CanvasWrapperProps) {
  const { isEditMode, addDrawItem, drawItems, drawColor } = props;
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
        displayRatio={CANVAS_DISPLAY_RATIO}
        squareMinSize={SQUARE_MIN_SIZE}
        pxHeight={PX_HEIGHT}
        pxWidth={PX_WIDTH}
        isEditMode={isEditMode}
        canvasLayout={canvasLayout}
      ></CanvasView>
      <CanvasEdit
        isEditMode={isEditMode}
        addDrawItem={addDrawItem}
        drawItems={drawItems}
        drawColor={drawColor}
        displayRatio={CANVAS_DISPLAY_RATIO}
        squareMinSize={SQUARE_MIN_SIZE}
        pxHeight={PX_HEIGHT}
        pxWidth={PX_WIDTH}
        canvasLayout={canvasLayout}
      ></CanvasEdit>
    </div>
  );
}
