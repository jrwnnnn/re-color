import Konva from "konva";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

export function useStage(
	containerRef: Readonly<{ value: HTMLDivElement | undefined }>,
) {
	// Konva.Stage  wraps all layers and owns the <canvas> element.
	let stage: Konva.Stage;

	// bgLayer is a static white rectangle that never gets drawn on.
	// Eraser reveals this layer.
	let bgLayer: Konva.Layer;

	// This layer is where all user strokes live.
	let drawLayer: Konva.Layer;

	// Creates the stage, adds the white background, adds the drawing layer,
	// then calls fitToViewport so the canvas starts centered and scaled to fit the window.
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

		fitToViewport(width, height);

		window.addEventListener("resize", handleResize);
		stage.on("wheel", handleWheel);
	}

	// Cleanup when the component unmounts. No memory leaks :)))
	function destroy() {
		window.removeEventListener("resize", handleResize);
		stage?.destroy();
	}

	// Figures out the biggest the canvas can be while still fitting inside the
	// window with some breathing room. Then centers it.
	function fitToViewport(viewportW: number, viewportH: number) {
		const scale =
			Math.min(viewportW / CANVAS_WIDTH, viewportH / CANVAS_HEIGHT) * 0.9;
		stage.scale({ x: scale, y: scale });
		stage.position({
			x: (viewportW - CANVAS_WIDTH * scale) / 2,
			y: (viewportH - CANVAS_HEIGHT * scale) / 2,
		});
		stage.batchDraw();
	}

	// When the window is resized, update the stage size to match the new window size.
	function handleResize() {
		if (!containerRef.value) return;
		const { width, height } = containerRef.value.getBoundingClientRect();
		stage.width(width);
		stage.height(height);
		stage.batchDraw();
	}

	// Scroll to zoom. Keeps the point under your cursor fixed while zooming.
	// If the canvas is smaller than the viewport it centers it, if it's bigger it
	// clamps so the user can't scroll past the edges.
	function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
		e.evt.preventDefault();

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

	// Translates your mouse position on screen to the actual coordinate on the canvas.
	function getPos() {
		const scale = stage.scaleX();
		const pointer = stage.getPointerPosition()!;
		return {
			x: Math.round((pointer.x - stage.x()) / scale),
			y: Math.round((pointer.y - stage.y()) / scale),
		};
	}

	// Creates a new clean canvas.
	function newCanvas() {
		if (!confirm("Start a new painting? Your current work will be lost."))
			return;
		drawLayer.destroyChildren();
		drawLayer.batchDraw();

		const { width, height } = containerRef.value!.getBoundingClientRect();
		fitToViewport(width, height);
	}

	// Exports the canvas as a PNG data URL.
	// Resets zoom/pan to 1:1 so we can capture the whole canvas,
	// then restores back the previous zoom/pan.
	function exportCanvas() {
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

	return {
		init,
		destroy,
		getPos,
		newCanvas,
		exportCanvas,
		getStage: () => stage,
		getDrawLayer: () => drawLayer,
	};
}
