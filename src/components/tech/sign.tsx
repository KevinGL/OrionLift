"use client";

import { useRef, useState, useEffect } from "react";

export default function Sign()
{
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = 600;
        canvas.height = 400;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";

        ctxRef.current = ctx;
    }, []);

    const startDrawing = (e: React.MouseEvent) =>
    {
        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent) =>
    {
        if (!isDrawing) return;

        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.lineTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
        ctx.stroke();
    };

    const stopDrawing = () =>
    {
        setIsDrawing(false);
    };

    const clear = () =>
    {
        ctxRef.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{ border: "1px solid black" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
            />

            <button onClick={clear}>Effacer</button>
        </>
    );
}
