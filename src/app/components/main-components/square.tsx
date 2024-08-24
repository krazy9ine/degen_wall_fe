import { SquareProps } from "@/app/types";

export default function Square(squareProps: SquareProps) {
  const { size, metadataItem } = squareProps;
  const { color, socials } = metadataItem;
  return (
    <div
      style={{
        backgroundColor: `#${color}`,
        width: `${size - 1}px`,
        height: `${size - 1}px`,
        border: "0.5px solid #616e96"
      }}
    />
  );
}
