import type { useCanvasStore } from "@/stores/useCanvasStore";

type CanvasStore = ReturnType<typeof useCanvasStore>;

export function useKeyboardShortcuts(canvasStore: CanvasStore) {
	const shortcuts: Record<string, typeof canvasStore.activeTool> = {
		b: "brush",
		e: "eraser",
		l: "line",
		r: "rect",
		c: "circle",
	};

	function onKeyDown(e: KeyboardEvent) {
		const key = e.key.toLowerCase();
		if (shortcuts[key]) canvasStore.setTool(shortcuts[key]);
	}

	return { onKeyDown };
}
