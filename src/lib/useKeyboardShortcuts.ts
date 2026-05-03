import type { useCanvasStore } from "@/stores/useCanvasStore";
import { usePaywallStore } from "@/stores/usePaywallStore";

type CanvasStore = ReturnType<typeof useCanvasStore>;

export function useKeyboardShortcuts(canvasStore: CanvasStore) {
	const paywallStore = usePaywallStore();
	const shortcuts: Record<string, typeof canvasStore.activeTool> = {
		b: "brush",
		e: "eraser",
		l: "line",
		r: "rect",
		c: "circle",
	};

	function onKeyDown(e: KeyboardEvent) {
		const key = e.key.toLowerCase();
		const tool = shortcuts[key];
		if (!tool) return;
		if (paywallStore.isToolLocked(tool)) {
			paywallStore.triggerNag("Tool locked. Upgrade to Pro to draw more.");
			paywallStore.openLightbox("Premium tool");
			return;
		}
		canvasStore.setTool(tool);
	}

	return { onKeyDown };
}
