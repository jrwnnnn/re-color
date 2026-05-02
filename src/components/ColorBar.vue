<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from "vue";
import { useColorStore, PALETTE } from "@/stores/useColorStore";
import Pickr from "@simonwep/pickr";
import colorNamer from "color-namer";

const colorStore = useColorStore();
const paletteNamed = PALETTE.map((p) => ({
	...p,
	name: colorNamer(p.hex).ntc[0].name,
}));

const pickrRef = ref<HTMLDivElement>();
let pickr: Pickr | null = null;

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
			<div ref="pickrRef"></div>

			<div id="swatch-bar" class="flex flex-wrap items-center gap-1">
				<button
					v-for="color in paletteNamed"
					:key="color.hex"
					@click="colorStore.setColor(color.hex)"
					:title="`${color.name} (${color.hex})`"
					:class="[
						'h-6 w-6 cursor-pointer border-2 transition-all duration-100',
						colorStore.activeColor.toLowerCase() === color.hex.toLowerCase()
							? 'scale-105 border-white/50'
							: 'border-transparent hover:scale-105 hover:border-white/40',
					]"
					:style="{ background: color.hex }"
				></button>
			</div>
		</div>
	</div>
</template>
