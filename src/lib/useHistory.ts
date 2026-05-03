import Konva from "konva";

const MAX_HISTORY = 50;

export function useHistory(getDrawLayer: () => Konva.Layer) {
	const undoStack: Konva.Node[] = [];
	const redoStack: Konva.Node[] = [];

	function saveSnapshot(node: Konva.Node) {
		undoStack.push(node);
		if (undoStack.length >= MAX_HISTORY) undoStack.shift();
		redoStack.length = 0;
	}

	function undo() {
		const node = undoStack.pop();
		if (!node) return;
		node.remove();
		redoStack.push(node);
		getDrawLayer().batchDraw();
	}

	function redo() {
		const node = redoStack.pop();
		if (!node) return;
		getDrawLayer().add(node as Konva.Shape);
		undoStack.push(node);
		getDrawLayer().batchDraw();
	}

	function clearHistory() {
		undoStack.length = 0;
		redoStack.length = 0;
	}

	return { saveSnapshot, undo, redo, clearHistory };
}
