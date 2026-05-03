import Konva from "konva";
import type { useCanvasStore } from "@/stores/useCanvasStore";
import type { useColorStore } from "@/stores/useColorStore";
import type { usePaywallStore } from "@/stores/usePaywallStore";

type CanvasStore = ReturnType<typeof useCanvasStore>;
type ColorStore = ReturnType<typeof useColorStore>;
type PaywallStore = ReturnType<typeof usePaywallStore>;

export function useTools(
	getDrawLayer: () => Konva.Layer,
	getPos: () => { x: number; y: number },
	canvasStore: CanvasStore,
	colorStore: ColorStore,
	paywallStore: PaywallStore,
	saveSnapshot: (node: Konva.Node) => void,
) {
	let isDrawing = false;
	let currentShape: Konva.Line | Konva.Rect | Konva.Ellipse | null = null;
	let startPos: { x: number; y: number } | null = null;

	function handleMouseDown() {
		const pos = getPos();
		const tool = canvasStore.activeTool;
		const color = colorStore.activeColor;
		const size = canvasStore.brushSize;
		const drawLayer = getDrawLayer();

		if (tool === "eraser" && !paywallStore.startEraserUse()) return;

		isDrawing = true;
		startPos = pos;

		if (tool === "brush" || tool === "eraser") {
			currentShape = new Konva.Line({
				points: [pos.x, pos.y, pos.x, pos.y],
				stroke: tool === "eraser" ? "#ffffff" : color,
				strokeWidth: size,
				tension: tool === "brush" ? 0.4 : 0,
				lineCap: "round",
				lineJoin: "round",
				globalCompositeOperation:
					tool === "eraser" ? "destination-out" : "source-over",
			});
			drawLayer.add(currentShape);
		}

		if (tool === "line") {
			currentShape = new Konva.Line({
				points: [pos.x, pos.y, pos.x, pos.y],
				stroke: color,
				strokeWidth: size,
				lineCap: "round",
			});
			drawLayer.add(currentShape);
		}

		if (tool === "rect") {
			currentShape = new Konva.Rect({
				x: pos.x,
				y: pos.y,
				width: 0,
				height: 0,
				stroke: color,
				strokeWidth: size,
				fill: "transparent",
			});
			drawLayer.add(currentShape);
		}

		if (tool === "circle") {
			currentShape = new Konva.Ellipse({
				x: pos.x,
				y: pos.y,
				radiusX: 0,
				radiusY: 0,
				stroke: color,
				strokeWidth: size,
				fill: "transparent",
			});
			drawLayer.add(currentShape);
		}
	}

	function handleMouseMove() {
		const pos = getPos();
		canvasStore.setCursorPosition({ x: pos.x, y: pos.y });
		if (!isDrawing || !currentShape) return;

		const tool = canvasStore.activeTool;
		if (tool === "eraser" && paywallStore.isEraserLocked) return;

		if (tool === "brush" || tool === "eraser") {
			(currentShape as Konva.Line).points([
				...(currentShape as Konva.Line).points(),
				pos.x,
				pos.y,
			]);
		}

		if (tool === "line") {
			const pts = (currentShape as Konva.Line).points();
			(currentShape as Konva.Line).points([pts[0], pts[1], pos.x, pos.y]);
		}

		if (tool === "rect" && startPos) {
			(currentShape as Konva.Rect).setAttrs({
				x: Math.min(startPos.x, pos.x),
				y: Math.min(startPos.y, pos.y),
				width: Math.abs(pos.x - startPos.x),
				height: Math.abs(pos.y - startPos.y),
			});
		}

		if (tool === "circle" && startPos) {
			const rX = Math.abs(pos.x - startPos.x) / 2;
			const rY = Math.abs(pos.y - startPos.y) / 2;
			(currentShape as Konva.Ellipse).setAttrs({
				x: (startPos.x + pos.x) / 2,
				y: (startPos.y + pos.y) / 2,
				radiusX: rX,
				radiusY: rY,
			});
		}

		getDrawLayer().batchDraw();
	}

	function handleMouseUp() {
		if (isDrawing && currentShape) saveSnapshot(currentShape);
		isDrawing = false;
		currentShape = null;
		startPos = null;
		if (canvasStore.activeTool === "eraser") {
			paywallStore.stopEraserUse();
		}
	}

	return { handleMouseDown, handleMouseMove, handleMouseUp };
}
