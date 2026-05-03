<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useColorStore } from "@/stores/useColorStore";
import { useSpeedDrawStore } from "@/stores/useSpeedDrawStore";
import { useStage } from "@/lib/useStage";
import { useHistory } from "@/lib/useHistory";
import { useCanvas } from "@/lib/useCanvas";
import { useTools } from "@/lib/useTools";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import { useSpeedDraw } from "@/lib/useSpeedDraw";
import Toolbar from "@/components/ToolBar.vue";
import ColorBar from "@/components/ColorBar.vue";
import StatusBar from "@/components/StatusBar.vue";
import SpeedDrawBar from "@/components/SpeedDrawBar.vue";

const canvasStore = useCanvasStore();
const colorStore = useColorStore();
const speedDrawStore = useSpeedDrawStore();

const rootRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();

const { init, destroy, getPos, getStage, getDrawLayer } =
	useStage(containerRef);
const { saveSnapshot, undo, redo, clearHistory } = useHistory(getDrawLayer);
const { newCanvas, exportCanvas, restoreFromDataURL } = useCanvas(
	getStage,
	getDrawLayer,
	clearHistory,
	containerRef,
);
const { handleMouseDown, handleMouseMove, handleMouseUp } = useTools(
	getDrawLayer,
	getPos,
	canvasStore,
	colorStore,
	saveSnapshot,
);
const { onKeyDown } = useKeyboardShortcuts(canvasStore);
const { isSpeedDraw, timerStarted, timer, onFirstStroke, finish } =
	useSpeedDraw(exportCanvas, getDrawLayer, clearHistory);

function wrappedMouseDown() {
	onFirstStroke();
	handleMouseDown();
}

onMounted(async () => {
	rootRef.value!.focus();
	init();

	if (speedDrawStore.canvasDataURL && !isSpeedDraw.value) {
		await restoreFromDataURL(speedDrawStore.canvasDataURL);
		speedDrawStore.setCanvasDataURL(null);
	}

	const stage = getStage();
	stage.on("mousedown touchstart", wrappedMouseDown);
	stage.on("mousemove touchmove", handleMouseMove);
	stage.on("mouseup touchend", handleMouseUp);

	window.electronAPI?.onNewCanvas(() => newCanvas());
	window.electronAPI?.onExport(async () => {
		const dataURL = exportCanvas();
		await window.electronAPI?.saveImage(dataURL);
	});
	window.electronAPI?.onUndo(() => undo());
	window.electronAPI?.onRedo(() => redo());
});

watch(
	() => colorStore.mode,
	(mode) => {
		document.querySelector(".pcr-app")?.setAttribute("data-mode", mode);
	},
	{ immediate: true },
);

onUnmounted(() => destroy());
</script>

<template>
	<div
		ref="rootRef"
		class="bg-surface flex h-screen flex-col outline-none"
		tabindex="0"
		@keydown="onKeyDown"
	>
		<SpeedDrawBar
			v-if="isSpeedDraw"
			:theme="speedDrawStore.theme!"
			:formatted="timer.formatted.value"
			:remaining="timer.remaining.value"
			:started="timerStarted"
			@finish="finish"
		/>
		<div class="flex min-h-0 flex-1 overflow-hidden">
			<Toolbar />
			<div
				class="bg-surface relative flex-1 overflow-hidden"
				:style="{ filter: colorStore.cssFilter }"
			>
				<div ref="containerRef" class="h-full w-full"></div>
			</div>
		</div>
		<ColorBar />
		<StatusBar />
	</div>
</template>
