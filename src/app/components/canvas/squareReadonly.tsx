import { SquareReadonlyProps } from "@/app/types";
import { useState } from "react";

const DEFAULT_OPACITY = 1;
const HOVER_OPACITY = 0.25;

export default function SquareReadonly(squareProps: SquareReadonlyProps) {
  const { size, metadataItem, onSetSocials } = squareProps;
  const { color, socials } = metadataItem;
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);

  const onHover = () => {
    setOpacity(HOVER_OPACITY);
    onSetSocials(socials);
  };

  const onUnhover = () => {
    setOpacity(DEFAULT_OPACITY);
  };

  return (
    <div
      style={{
        backgroundColor: `#${color}`,
        width: `${size}px`,
        height: `${size}px`,
        border: "0.5px solid #616e96",
        flexShrink: 0,
        opacity: opacity,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
    />
  );
}
