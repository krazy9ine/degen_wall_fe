"use client";

import { EventListenerContext } from "@/app/context/EventListenerProvider";
import { CanvasLayout, MetadataAccountParsed } from "@/app/types";
import { useContext, useEffect, useRef, useState } from "react";
import { getUpdatedCanvas, initAndGetCanvas } from "./canvas-util";
import Square from "./square";
import AnchorInterface from "@/app/web3/program";
import { Connection } from "@solana/web3.js";

const anchorInterface = new AnchorInterface(null as unknown as Connection);
const { PX_HEIGHT, PX_WIDTH } = anchorInterface;
const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 12;

export default function Canvas() {
  const setEventHandler = useContext(EventListenerContext);
  const isInitialRender = useRef(true);
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>([]);

  const squareSize = Math.max(
    SQUARE_MIN_SIZE,
    typeof window !== "undefined"
      ? Math.floor((window.innerWidth * CANVAS_DISPLAY_RATIO) / PX_WIDTH)
      : SQUARE_MIN_SIZE
  );

  useEffect(() => {
    const updateCanvas = (event: MetadataAccountParsed) => {
      const [newCanvas] = getUpdatedCanvas(event);
      setCanvasLayout([...newCanvas]);
    };

    const onInitAndGetCanvas = async () => {
      const initialCanvas = await initAndGetCanvas();
      setCanvasLayout(initialCanvas);
      setEventHandler(updateCanvas);
    };

    if (isInitialRender.current) {
      isInitialRender.current = false;
      onInitAndGetCanvas();
    }
  }, [canvasLayout, setEventHandler]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${PX_HEIGHT}, ${squareSize}px)`,
        gridTemplateColumns: `repeat(${PX_WIDTH}, ${squareSize}px)`,
      }}
    >
      {canvasLayout.map((pixel, index) => {
        const x = index % PX_WIDTH;
        const y = Math.floor(index / PX_WIDTH);
        return (
          <Square
            key={`${x}-${y}`}
            size={squareSize}
            metadataItem={pixel}
          ></Square>
        );
      })}
    </div>
  );
}
