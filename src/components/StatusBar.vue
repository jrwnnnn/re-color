<script setup lang="ts">
import { useCanvasStore } from "../stores/useCanvasStore";
import { useColorStore } from "../stores/useColorStore";

const canvasStore = useCanvasStore();
const colorStore = useColorStore();
</script>

<template>
	<div
		class="bg-panel-dark flex items-center justify-between gap-4 px-3 py-1 text-[11px] text-white/75"
	>
		<div class="flex items-center gap-1.5">
			<span
				class="h-2.5 w-2.5 shrink-0 rounded-full border border-white/50"
				:style="{ background: colorStore.activeColor }"
			/>
			<p>{{ colorStore.colorName }}</p>
		</div>

		<div v-if="canvasStore.cursorPos" class="flex items-center gap-1 font-mono">
			<p>X:</p>
			<p>{{ canvasStore.cursorPos.x }}</p>
			<p class="ml-1.5">Y:</p>
			<p>{{ canvasStore.cursorPos.y }}</p>
		</div>
	</div>
</template>
