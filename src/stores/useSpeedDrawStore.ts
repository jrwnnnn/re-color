import { defineStore } from "pinia";
import { ref } from "vue";

export const useSpeedDrawStore = defineStore("speeddraw", () => {
	const theme = ref<string | null>(null);
	const startedAt = ref<number | null>(null);
	const elapsedSeconds = ref(0);
	const canvasDataURL = ref<string | null>(null);

	function setTheme(t: string | null) {
		theme.value = t;
	}

	function startTimer() {
		startedAt.value = Date.now();
	}

	function stopTimer() {
		if (!startedAt.value) return;
		elapsedSeconds.value = Math.floor((Date.now() - startedAt.value) / 1000);
	}

	function setCanvasDataURL(url: string | null) {
		canvasDataURL.value = url;
	}

	function reset() {
		theme.value = null;
		startedAt.value = null;
		elapsedSeconds.value = 0;
		canvasDataURL.value = null;
	}

	return {
		theme,
		elapsedSeconds,
		canvasDataURL,
		setTheme,
		startTimer,
		stopTimer,
		setCanvasDataURL,
		reset,
	};
});
