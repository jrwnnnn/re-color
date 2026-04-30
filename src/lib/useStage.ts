import Konva from "konva";

export function useStage(
	containerRef: Readonly<{ value: HTMLDivElement | undefined }>,
) {
	// Konva.Stage  wraps all layers and owns the <canvas> element.
	// We never put this in a Vue ref because Konva manages its own reactivity internally.
	let stage: Konva.Stage;

	// bgLayer is a static white rectangle that never gets drawn on.
	// It exists purely so the eraser has something to reveal — eraser uses
	let bgLayer: Konva.Layer;

	// This layer is where all user strokes live.
	let drawLayer: Konva.Layer;

	function init() {
		const { width, height } = containerRef.value!.getBoundingClientRect();

		stage = new Konva.Stage({ container: containerRef.value!, width, height });

		bgLayer = new Konva.Layer();
		bgLayer.add(
			new Konva.Rect({
				x: 0,
				y: 0,
				width,
				height,
				fill: "#ffffff",
				listening: false,
			}),
		);
		stage.add(bgLayer);

		drawLayer = new Konva.Layer();
		drawLayer.clipFunc((ctx) => {
			ctx.rect(0, 0, stage.width(), stage.height());
		});
		stage.add(drawLayer);

		window.addEventListener("resize", handleResize);
		stage.on("wheel", handleWheel);
	}

	function destroy() {
		window.removeEventListener("resize", handleResize);
		stage?.destroy();
	}

	function handleResize() {
		if (!containerRef.value) return;
		const { width, height } = containerRef.value.getBoundingClientRect();
		stage.width(width);
		stage.height(height);
		(bgLayer.findOne("Rect") as Konva.Rect).setAttrs({ width, height });
		drawLayer.clipFunc((ctx) => ctx.rect(0, 0, width, height));
		bgLayer.batchDraw();
	}

	function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
		e.evt.preventDefault();

		const scaleBy = 1.08;
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition()!;
		const rawScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

		// Allow zoom out, but don't go below 0.1 or above 8
		const newScale = Math.max(0.1, Math.min(8, rawScale));

		stage.scale({ x: newScale, y: newScale });

		const w = stage.width();
		const h = stage.height();

		let newX = pointer.x - (pointer.x - stage.x()) * (newScale / oldScale);
		let newY = pointer.y - (pointer.y - stage.y()) * (newScale / oldScale);

		// If canvas is smaller than viewport, center it instead of clamping
		if (newScale < 1) {
			newX = (w - w * newScale) / 2;
			newY = (h - h * newScale) / 2;
		} else {
			// Clamping only applies when zoomed in
			newX = Math.min(0, Math.max(newX, w - w * newScale));
			newY = Math.min(0, Math.max(newY, h - h * newScale));
		}

		stage.position({ x: newX, y: newY });
		stage.batchDraw();
	}

	/*
	This converts screen-space mouse coordinates to canvas-space coordinates.
	When zoomed in, the stage is scaled and offset dividing by scale and
	subtracting the stage's position gives the true point on the canvas.\
	*/
	function getPos() {
		const scale = stage.scaleX();
		const pointer = stage.getPointerPosition()!;
		return {
			x: Math.round((pointer.x - stage.x()) / scale),
			y: Math.round((pointer.y - stage.y()) / scale),
		};
	}

	function newCanvas() {
		if (!confirm("Start a new painting? Your current work will be lost."))
			return;
		drawLayer.destroyChildren();
		drawLayer.batchDraw();
		stage.scale({ x: 1, y: 1 });
		stage.position({ x: 0, y: 0 });
		stage.batchDraw();
	}

	return {
		init,
		destroy,
		getPos,
		newCanvas,
		getStage: () => stage,
		getDrawLayer: () => drawLayer,
	};
}
