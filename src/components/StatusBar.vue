<script setup lang="ts">
import { watch } from "vue";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useColorStore, type ColorblindMode } from "@/stores/useColorStore";
import { usePaywallStore } from "@/stores/usePaywallStore";

const canvasStore = useCanvasStore();
const colorStore = useColorStore();
const paywallStore = usePaywallStore();

function handleModeChange(value: string) {
	if (paywallStore.isModeLocked(value)) {
		paywallStore.triggerNag("Color mode locked. Upgrade to Pro.");
		paywallStore.openLightbox("Color mode");
		colorStore.setMode("deuteranopia");
		return;
	}
	colorStore.setMode(value as ColorblindMode);
}

watch(
	() => colorStore.mode,
	(mode) => {
		if (paywallStore.isModeLocked(mode)) {
			colorStore.setMode("deuteranopia");
		}
	},
	{ immediate: true },
);
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

		<div class="flex items-center gap-2">
			<div v-if="canvasStore.cursorPos" class="flex items-center gap-1">
				<p>X:</p>
				<p>{{ canvasStore.cursorPos.x }}</p>
				<p class="ml-1.5">Y:</p>
				<p>{{ canvasStore.cursorPos.y }}</p>
			</div>
			<select
				:value="colorStore.mode"
				@change="handleModeChange(($event.target as HTMLSelectElement).value)"
				class="text-xxs cursor-pointer font-semibold tracking-wide outline-none"
				data-testid="colormode-select"
			>
				<option
					class="bg-panel text-white"
					value="normal"
					:disabled="paywallStore.isModeLocked('normal')"
				>
					Normal Vision (Pro)
				</option>
				<option class="bg-panel text-white" value="deuteranopia">
					Deuteranopia
				</option>
				<option
					class="bg-panel text-white"
					value="protanopia"
					:disabled="paywallStore.isModeLocked('protanopia')"
				>
					Protanopia (Pro)
				</option>
				<option
					class="bg-panel text-white"
					value="tritanopia"
					:disabled="paywallStore.isModeLocked('tritanopia')"
				>
					Tritanopia (Pro)
				</option>
			</select>
		</div>
	</div>
</template>
