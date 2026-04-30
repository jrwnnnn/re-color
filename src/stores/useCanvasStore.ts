import { defineStore } from "pinia";
import { ref } from "vue";

export type Tool = "brush" | "eraser" | "line" | "rect" | "circle";

export const useCanvasStore = defineStore("canvas", () => {
	const activeTool = ref<Tool>("brush");
	const brushSize = ref(8);
	const cursorPos = ref<{ x: number; y: number } | null>(null);

	function setTool(tool: Tool) {
		activeTool.value = tool;
	}

	function setBrushSize(size: number) {
		brushSize.value = size;
	}

	function setCursorPosition(pos: { x: number; y: number } | null) {
		cursorPos.value = pos;
	}

	return {
		activeTool,
		brushSize,
		cursorPos,
		setTool,
		setBrushSize,
		setCursorPosition,
	};
});
