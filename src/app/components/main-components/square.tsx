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
        border: "1px solid white"
      }}
      onMouseEnter={() => console.log(`Hovered`)}
    />
  );
}
