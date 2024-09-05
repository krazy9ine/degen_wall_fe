"use client";

import { EventListenerContext } from "@/app/context/EventListenerProvider";
import { CanvasLayout, MetadataAccountParsed, Socials } from "@/app/types";
import { useContext, useEffect, useRef, useState } from "react";
import {
  getDefaultCanvas,
  getUpdatedCanvas,
  initAndGetCanvas,
} from "./canvas-util";
import Square from "./square";
import AnchorInterface from "@/app/web3/program";
import { Connection } from "@solana/web3.js";
import { RPC_URL_KEY } from "@/app/constants";

const anchorInterface = new AnchorInterface(null as unknown as Connection);
const { PX_HEIGHT, PX_WIDTH } = anchorInterface;
const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 12;

export default function Canvas() {
  const setEventHandler = useContext(EventListenerContext);
  const isInitialRender = useRef(true);
  const [canvasLayout, setCanvasLayout] = useState<CanvasLayout>(
    getDefaultCanvas()
  );
  const [socials, setSocials] = useState<Socials>();
  const squareSize = Math.max(
    SQUARE_MIN_SIZE,
    Math.min(
      Math.floor((window.innerWidth * CANVAS_DISPLAY_RATIO) / PX_WIDTH),
      Math.floor((window.innerHeight * CANVAS_DISPLAY_RATIO) / PX_HEIGHT)
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

  const onSetSocials = (socials: Socials) => {
    setSocials(socials);
  };

  return (
    <div id="canvas wrapper" className="flex">
      <div id="canvas-readonly">
        {Array.from({ length: PX_HEIGHT }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              display: "flex",
            }}
          >
            {Array.from({ length: PX_WIDTH }).map((_, colIndex) => {
              const index = rowIndex * PX_WIDTH + colIndex;
              const pixel = canvasLayout[index];
              return (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  size={squareSize}
                  metadataItem={pixel}
                  onSetSocials={onSetSocials}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div
        id="socials-tab"
        style={{ visibility: socials?.payer ? "visible" : "hidden" }}
      >
        <p>
          {socials?.name} ${socials?.ticker}
        </p>
        <div>
          <img src={socials?.image} alt="image"></img>
        </div>
        <p>{socials?.description}</p>
      </div>
    </div>
  );
}
