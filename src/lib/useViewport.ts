import Konva from "konva";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/constants";

export function useViewport(
	getStage: () => Konva.Stage,
	containerRef: Readonly<{ value: HTMLDivElement | undefined }>,
) {
	function fitToViewport(viewportW: number, viewportH: number) {
		const stage = getStage();
		const scale =
			Math.min(viewportW / CANVAS_WIDTH, viewportH / CANVAS_HEIGHT) * 0.9;
		stage.scale({ x: scale, y: scale });
		stage.position({
			x: (viewportW - CANVAS_WIDTH * scale) / 2,
			y: (viewportH - CANVAS_HEIGHT * scale) / 2,
		});
		stage.batchDraw();
	}

	function handleResize() {
		if (!containerRef.value) return;
		const stage = getStage();
		const { width, height } = containerRef.value.getBoundingClientRect();
		stage.width(width);
		stage.height(height);
		stage.batchDraw();
	}

	function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
		e.evt.preventDefault();
		const stage = getStage();
		const scaleBy = 1.08;
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition()!;
		const rawScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
		const newScale = Math.max(0.1, Math.min(8, rawScale));

		stage.scale({ x: newScale, y: newScale });

		const w = stage.width();
		const h = stage.height();

		let newX = pointer.x - (pointer.x - stage.x()) * (newScale / oldScale);
		let newY = pointer.y - (pointer.y - stage.y()) * (newScale / oldScale);

		const canvasW = CANVAS_WIDTH * newScale;
		const canvasH = CANVAS_HEIGHT * newScale;
		if (canvasW < w && canvasH < h) {
			newX = (w - canvasW) / 2;
			newY = (h - canvasH) / 2;
		} else {
			newX = Math.min(0, Math.max(newX, w - canvasW));
			newY = Math.min(0, Math.max(newY, h - canvasH));
		}

		stage.position({ x: newX, y: newY });
		stage.batchDraw();
	}

	return { fitToViewport, handleResize, handleWheel };
}
