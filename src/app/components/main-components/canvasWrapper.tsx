/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CanvasLayout,
  CanvasReadonlyProps,
  CanvasEditProps,
  MetadataAccountParsed,
  Socials,
} from "@/app/types";
import { CanvasReadonly, CanvasEdit } from "./canvas-components";
import { memo, useContext, useEffect, useRef, useState } from "react";
import {
  getDefaultCanvas,
  getUpdatedCanvas,
  initAndGetCanvas,
} from "./canvas-components/canvas-util";
import { PX_HEIGHT, PX_WIDTH, RPC_URL_KEY } from "@/app/constants";
import { EventListenerContext } from "@/app/context/EventListenerProvider";
import useWindowDimensions from "@/app/hooks/useWindowDimensions";

const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 12;

const CanvasEditMemo = memo(CanvasEdit);

export default function CanvasWrapper(
  props: CanvasEditProps & { onSetSocials: (socials: Socials) => void }
) {
  const { onSetSocials, ...canvasEditProps } = props;
  const [canvasReadonly, setCanvasReadonly] = useState<CanvasLayout>(
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

  const canvasReadonlyProps: CanvasReadonlyProps = {
    squareSize,
    isEditMode: canvasEditProps.isEditMode,
    canvasReadonly,
  };

  useEffect(() => {
    const updateCanvas = (event: MetadataAccountParsed) => {
      const [newCanvas] = getUpdatedCanvas(event);
      setCanvasReadonly([...newCanvas]);
    };

    const onInitAndGetCanvas = async () => {
      const endpoint = localStorage.getItem(RPC_URL_KEY) || "";
      const initialCanvas = await initAndGetCanvas(endpoint);
      setCanvasReadonly(initialCanvas);
    };

    if (isInitialRender.current) {
      isInitialRender.current = false;
      setEventHandler(updateCanvas);
      onInitAndGetCanvas();
    }
  }, [canvasReadonly, setEventHandler]);
  return (
    <div id="canvas wrapper" className="flex">
      <CanvasReadonly
        {...canvasReadonlyProps}
        onSetSocials={onSetSocials}
      ></CanvasReadonly>
      <CanvasEditMemo
        {...canvasReadonlyProps}
        {...canvasEditProps}
      ></CanvasEditMemo>
    </div>
  );
}
