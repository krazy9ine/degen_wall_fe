import { SquareProps } from "@/app/types";

export default function Square(squareProps: SquareProps) {
  const { size, metadataItem } = squareProps;
  const { color, socials } = metadataItem;
  return (
    <div
      style={{
        backgroundColor: `#${color}`,
        width: `${size}px`,
        height: `${size}px`,
        border: "0.5px solid #616e96",
        flexShrink: 0,
      }}
    />
  );
}
