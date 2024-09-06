/* eslint-disable @next/next/no-img-element */
"use client";

import { CanvasProps, Socials } from "@/app/types";
import { useState } from "react";
import SquareReadonly from "./squareReadonly";
import useWindowDimensions from "@/app/hooks/useWindowDimensions";

export default function CanvasView(props: CanvasProps) {
  const {
    displayRatio,
    squareMinSize,
    pxHeight,
    pxWidth,
    isEditMode,
    canvasLayout,
  } = props;
  const [socials, setSocials] = useState<Socials>();
  const { height, width } = useWindowDimensions();

  const squareSize = Math.max(
    squareMinSize,
    Math.min(
      Math.floor((width * displayRatio) / pxWidth),
      Math.floor((height * displayRatio) / pxHeight)
    )
  );

  const onSetSocials = (socials: Socials) => {
    setSocials(socials);
  };

  return (
    <div
      id="canvas-view"
      className="flex"
      style={{ opacity: isEditMode ? 0 : 1 }}
    >
      <div id="canvas-readonly">
        {Array.from({ length: pxHeight }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              display: "flex",
            }}
          >
            {Array.from({ length: pxWidth }).map((_, colIndex) => {
              const index = rowIndex * pxWidth + colIndex;
              const pixel = canvasLayout[index];
              return (
                <SquareReadonly
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
        <p
          style={{
            display: socials?.name || socials?.ticker ? "block" : "none",
          }}
        >
          {socials?.name} ${socials?.ticker}
        </p>
        <div style={{ display: socials?.image ? "block" : "none" }}>
          <img src={socials?.image} alt="image"></img>
        </div>
        <p style={{ display: socials?.description ? "block" : "none" }}>
          {socials?.description}
        </p>
        <p style={{ display: socials?.website ? "block" : "none" }}>
          Website: {socials?.website}
        </p>
        <p style={{ display: socials?.twitter ? "block" : "none" }}>
          Twitter: {socials?.twitter}
        </p>
        <p style={{ display: socials?.community ? "block" : "none" }}>
          Community: {socials?.community}
        </p>
        <p style={{ display: socials?.token ? "block" : "none" }}>
          Chart: https://dexscreener.com/solana/{socials?.token}
        </p>
      </div>
    </div>
  );
}
