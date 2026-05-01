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

export type ColorblindMode =
	| "normal"
	| "deuteranopia"
	| "protanopia"
	| "tritanopia";

const CSS_FILTERS: Record<ColorblindMode, string> = {
	normal: "none",
	deuteranopia: "url(#deuteranopia)",
	protanopia: "url(#protanopia)",
	tritanopia: "url(#tritanopia)",
};

export const useColorStore = defineStore("color", () => {
	const activeColor = ref("#000000");

	// Persisted so the user's mode survives app restarts
	const mode = ref<ColorblindMode>(
		(localStorage.getItem("colorblindMode") as ColorblindMode) ?? "normal",
	);

	// color-namer compares the hex against thousands of named colors and returns
	// the closest match. .ntc[0].name uses the "Name That Color" dataset
	const colorName = computed(() => colorNamer(activeColor.value).ntc[0].name);

	const cssFilter = computed(() => CSS_FILTERS[mode.value]);

	function setColor(hex: string) {
		activeColor.value = hex;
	}

	function setMode(m: ColorblindMode) {
		mode.value = m;
		localStorage.setItem("colorblindMode", m);
	}

	return { activeColor, colorName, mode, cssFilter, setColor, setMode };
});
