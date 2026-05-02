import Konva from "konva";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/constants";
import { useViewport } from "@/lib/useViewport";

export function useCanvas(
	getStage: () => Konva.Stage,
	getDrawLayer: () => Konva.Layer,
	clearHistory: () => void,
	containerRef: Readonly<{ value: HTMLDivElement | undefined }>,
) {
	function newCanvas() {
		if (!confirm("Start a new painting? Your current work will be lost."))
			return;
		getDrawLayer().destroyChildren();
		getDrawLayer().batchDraw();
		clearHistory();

		const { width, height } = containerRef.value!.getBoundingClientRect();
		const { fitToViewport } = useViewport(getStage, containerRef);
		fitToViewport(width, height);
	}

	function exportCanvas() {
		const stage = getStage();
		const prevScale = stage.scaleX();
		const prevPos = stage.position();

		stage.scale({ x: 1, y: 1 });
		stage.position({ x: 0, y: 0 });

		const dataURL = stage.toDataURL({
			x: 0,
			y: 0,
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			pixelRatio: 1,
		});

		stage.scale({ x: prevScale, y: prevScale });
		stage.position(prevPos);
		stage.batchDraw();

		return dataURL;
	}

	return { newCanvas, exportCanvas };
}
