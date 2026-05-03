<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from "vue";
import { useColorStore, PALETTE } from "@/stores/useColorStore";
import { usePaywallStore } from "@/stores/usePaywallStore";
import Pickr from "@simonwep/pickr";
import colorNamer from "color-namer";

const colorStore = useColorStore();
const paywallStore = usePaywallStore();
const paletteNamed = PALETTE.map((p) => ({
	...p,
	name: colorNamer(p.hex).ntc[0].name,
}));

const pickrRef = ref<HTMLDivElement>();
let pickr: Pickr | null = null;
let ignorePickrChange = false;

onMounted(() => {
	pickr = Pickr.create({
		el: pickrRef.value!,
		theme: "nano",
		default: colorStore.activeColor,
		components: {
			preview: true,
			hue: true,
			interaction: {
				hex: false,
				input: true,
				save: false,
			},
		},
	});

	pickr.on("change", (color: Pickr.HSVaColor) => {
		if (ignorePickrChange) {
			ignorePickrChange = false;
			return;
		}
		if (paywallStore.isPickerLocked) {
			paywallStore.triggerNag("Custom color picker is Pro-only.");
			paywallStore.openLightbox("Custom color picker");
			ignorePickrChange = true;
			pickr?.setColor(colorStore.activeColor);
			pickr?.applyColor();
			window.setTimeout(() => {
				ignorePickrChange = false;
			}, 0);
			return;
		}
		const hex = color.toHEXA().toString().slice(0, 7);
		colorStore.setColor(hex);
		pickr?.applyColor();
	});
});

watch(
	() => colorStore.activeColor,
	(hex) => {
		pickr!.setColor(hex);
	},
);

function handleSwatchClick(hex: string, index: number) {
	if (paywallStore.isSwatchLocked(index)) {
		paywallStore.triggerNag("Premium swatches require Pro.");
		paywallStore.openLightbox("Premium swatch");
		return;
	}
	colorStore.setColor(hex);
}

onUnmounted(() => pickr?.destroyAndRemove());
</script>

<template>
	<div
		class="bg-panel border-accent flex items-center gap-2.5 border-t px-2 py-1"
	>
		<div
			class="flex items-center gap-2.5"
			:style="{ filter: colorStore.cssFilter }"
		>
			<div class="relative">
				<div ref="pickrRef"></div>
				<button
					v-if="paywallStore.isPickerLocked"
					class="annoy-lock-overlay"
					@click="paywallStore.triggerNag('Custom color picker is Pro-only.')"
				>
					PRO
				</button>
			</div>

			<div id="swatch-bar" class="flex flex-wrap items-center gap-1">
				<button
					v-for="(color, index) in paletteNamed"
					:key="color.hex"
					@click="handleSwatchClick(color.hex, index)"
					:title="`${color.name} (${color.hex})`"
					:class="[
						'relative h-6 w-6 overflow-hidden border-2 transition-all duration-100',
						paywallStore.isSwatchLocked(index)
							? 'cursor-not-allowed border-white/10 opacity-60'
							: 'cursor-pointer',
						colorStore.activeColor.toLowerCase() === color.hex.toLowerCase()
							? 'scale-105 border-white/50'
							: 'border-transparent hover:scale-105 hover:border-white/40',
					]"
					:style="{ background: color.hex }"
				>
					<span
						v-if="paywallStore.isSwatchLocked(index)"
						class="annoy-lock-label"
					>
						PRO
					</span>
				</button>
			</div>
		</div>
	</div>
</template>
