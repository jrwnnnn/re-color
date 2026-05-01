<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useCanvasStore } from "../stores/useCanvasStore";
import { useColorStore } from "../stores/useColorStore";
import { useStage } from "../lib/useStage";
import { useTools } from "../lib/useTools";
import { useKeyboardShortcuts } from "../lib/useKeyboardShortcuts";
import Toolbar from "../components/ToolBar.vue";
import ColorBar from "../components/ColorBar.vue";
import StatusBar from "../components/StatusBar.vue";

const canvasStore = useCanvasStore();
const colorStore = useColorStore();

const rootRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();

const { init, destroy, getPos, newCanvas, getStage, getDrawLayer } =
	useStage(containerRef);
const { handleMouseDown, handleMouseMove, handleMouseUp } = useTools(
	getDrawLayer,
	getPos,
	canvasStore,
	colorStore,
);
const { onKeyDown } = useKeyboardShortcuts(canvasStore);

onMounted(() => {
	rootRef.value!.focus();
	init();

	const stage = getStage();
	stage.on("mousedown touchstart", handleMouseDown);
	stage.on("mousemove touchmove", handleMouseMove);
	stage.on("mouseup touchend", handleMouseUp);

	window.electronAPI?.onNewPainting(() => newCanvas());
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
