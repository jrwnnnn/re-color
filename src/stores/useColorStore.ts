import { defineStore } from "pinia";
import { ref, computed } from "vue";
import colorNamer from "color-namer";

export const PALETTE = [
	{ hex: "#000000" },
	{ hex: "#FFFFFF" },
	{ hex: "#808080" },
	{ hex: "#C0C0C0" },
	{ hex: "#0072B2" },
	{ hex: "#56B4E9" },
	{ hex: "#009E73" },
	{ hex: "#00CBA8" },
	{ hex: "#E69F00" },
	{ hex: "#F0E442" },
	{ hex: "#D55E00" },
	{ hex: "#CC79A7" },
	{ hex: "#8B4513" },
	{ hex: "#F5DEB3" },
	{ hex: "#2E4057" },
	{ hex: "#7B2D8B" },
];

export const useColorStore = defineStore("color", () => {
	const activeColor = ref("#000000");
	const colorName = computed(() => colorNamer(activeColor.value).ntc[0].name);

	function setColor(hex: string) {
		activeColor.value = hex;
	}

	return { activeColor, colorName, setColor };
});
