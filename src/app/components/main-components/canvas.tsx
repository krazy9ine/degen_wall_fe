"use client";

import { PX_HEIGHT, PX_WIDTH } from "@/app/constants";
import { useEffect, useRef } from "react";

const CANVAS_DISPLAY_RATIO = 0.8;
const SQUARE_MIN_SIZE = 12;

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null); // Ref to store the canvas context

  const rows = PX_HEIGHT;
  const cols = PX_WIDTH;
  const squareSize = Math.max(
    SQUARE_MIN_SIZE,
    typeof window !== "undefined"
      ? Math.floor((window.innerWidth * CANVAS_DISPLAY_RATIO) / cols)
      : SQUARE_MIN_SIZE
  );
  const borderColor = "#FFFFFF";

  // Function to update a specific square
  const updateSquare = (row: number, col: number, fillColor: string) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Calculate the position of the square
    const x = col * squareSize;
    const y = row * squareSize;

    // Clear the square (if needed)
    ctx.clearRect(x, y, squareSize, squareSize);

    // Draw the new square
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, squareSize, squareSize);

    // Redraw the border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, squareSize, squareSize);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        //@ts-ignore
        ctxRef.current = ctx; // Store the context in the ref

        // Set the canvas size
        canvas.width = cols * squareSize;
        canvas.height = rows * squareSize;

        // Initial draw of the grid
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * squareSize;
            const y = row * squareSize;

            // Draw the square (black fill color for the squares)
            ctx.fillStyle = "#000000";
            ctx.fillRect(x, y, squareSize, squareSize);

            // Draw the border
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, squareSize, squareSize);
          }
        }
      }
    }
  });

  return <canvas ref={canvasRef} />;
}
