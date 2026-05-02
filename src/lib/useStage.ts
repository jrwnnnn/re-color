import Konva from "konva";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/constants";
import { useViewport } from "@/lib/useViewport";

export function useStage(
	containerRef: Readonly<{ value: HTMLDivElement | undefined }>,
) {
	let stage: Konva.Stage;
	let bgLayer: Konva.Layer;
	let drawLayer: Konva.Layer;

	function init() {
		const { width, height } = containerRef.value!.getBoundingClientRect();

		stage = new Konva.Stage({ container: containerRef.value!, width, height });

		bgLayer = new Konva.Layer();
		bgLayer.add(
			new Konva.Rect({
				x: 0,
				y: 0,
				width: CANVAS_WIDTH,
				height: CANVAS_HEIGHT,
				fill: "#ffffff",
				listening: false,
			}),
		);
		stage.add(bgLayer);

		drawLayer = new Konva.Layer();
		drawLayer.clipFunc((ctx) => {
			ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		});
		stage.add(drawLayer);

		const { fitToViewport, handleResize, handleWheel } = useViewport(
			() => stage,
			containerRef,
		);

		fitToViewport(width, height);
		window.addEventListener("resize", handleResize);
		stage.on("wheel", handleWheel);
	}

	function destroy() {
		window.removeEventListener("resize", () => {});
		stage?.destroy();
	}

	function getPos() {
		const scale = stage.scaleX();
		const pointer = stage.getPointerPosition()!;
		return {
			x: Math.round((pointer.x - stage.x()) / scale),
			y: Math.round((pointer.y - stage.y()) / scale),
		};
	}

	return {
		init,
		destroy,
		getPos,
		getStage: () => stage,
		getDrawLayer: () => drawLayer,
	};
}
