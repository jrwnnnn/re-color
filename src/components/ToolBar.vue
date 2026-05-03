<script setup lang="ts">
import { useCanvasStore, type Tool } from "@/stores/useCanvasStore";
import type { Component } from "vue";
import BrushIcon from "@/assets/brush-tool.svg?component";
import EraserIcon from "@/assets/eraser-tool.svg?component";
import LineIcon from "@/assets/line-tool.svg?component";
import RectIcon from "@/assets/rect-tool.svg?component";
import CircleIcon from "@/assets/circle-tool.svg?component";

const store = useCanvasStore();

const tools: { id: Tool; label: string; shortcut: string; icon: Component }[] =
	[
		{
			id: "brush",
			label: "Brush",
			shortcut: "B",
			icon: BrushIcon,
		},
		{
			id: "eraser",
			label: "Eraser",
			shortcut: "E",
			icon: EraserIcon,
		},
		{
			id: "line",
			label: "Line",
			shortcut: "L",
			icon: LineIcon,
		},
		{
			id: "rect",
			label: "Rect",
			shortcut: "R",
			icon: RectIcon,
		},
		{
			id: "circle",
			label: "Circle",
			shortcut: "C",
			icon: CircleIcon,
		},
	];
</script>

<template>
	<div
		class="bg-panel border-accent flex flex-col items-center gap-2 overflow-y-auto border-r p-1 py-2"
	>
		<div class="flex w-full flex-col items-center gap-1">
			<button
				v-for="tool in tools"
				:key="tool.id"
				@click="store.setTool(tool.id)"
				:title="`${tool.label} (${tool.shortcut})`"
				:class="[
					'flex w-full cursor-pointer flex-col items-center gap-1 rounded-sm p-1 transition-all duration-150',
					store.activeTool === tool.id
						? 'text-white'
						: 'text-muted hover:text-white',
				]"
				:data-testid="tool.id"
			>
				<component :is="tool.icon" class="h-4.5 w-4.5" />
				<span class="text-[9px] font-medium tracking-wide">{{
					tool.label
				}}</span>
			</button>
		</div>

		<hr class="border-accent my-1.5 h-px w-full border" />

		<div class="flex w-full flex-col items-center gap-2 px-1">
			<span class="text-muted text-xxs text-center">Size</span>

			<div
				id="preview-dot"
				class="bg-panel flex h-9 w-9 items-center justify-center rounded-lg"
			>
				<div
					class="rounded-full bg-white"
					:style="{
						width: Math.min(store.brushSize, 32) + 'px',
						height: Math.min(store.brushSize, 32) + 'px',
						minWidth: '2px',
						minHeight: '2px',
					}"
				/>
			</div>

			<input
				type="range"
				min="1"
				max="60"
				orient="vertical"
				:value="store.brushSize"
				@input="store.setBrushSize(+($event.target as HTMLInputElement).value)"
			/>
			<span class="text-muted text-xxs text-center"
				>{{ store.brushSize }}px</span
			>
		</div>
	</div>
</template>

<style scoped>
input[type="range"][orient="vertical"] {
	writing-mode: vertical-lr;
	direction: rtl;
	height: 80px;
	width: 4px;
	accent-color: #4d9eff;
	cursor: pointer;
}
</style>
