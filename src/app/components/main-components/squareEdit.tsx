import { SquareEditProps } from "@/app/types";

export default function SquareEdit(squareProps: SquareEditProps) {
  const { size, metadataItem, onSetSquareColor } = squareProps;
  const { color } = metadataItem;

  return (
    <div
      style={{
        backgroundColor: `#${color}`,
        width: `${size}px`,
        height: `${size}px`,
        border: "0.5px solid #616e96",
        flexShrink: 0,
      }}
      onMouseEnter={() => onSetSquareColor()}
      onClick={() => onSetSquareColor(true)}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}
