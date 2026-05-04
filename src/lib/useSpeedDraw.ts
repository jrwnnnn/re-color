import { ref, computed, watch } from "vue";
import type Konva from "konva";
import { useRouter } from "vue-router";
import { useSpeedDrawStore } from "@/stores/useSpeedDrawStore";
import { useTimer } from "@/lib/useTimer";

export function useSpeedDraw(
	exportCanvas: () => string,
	getDrawLayer: () => Konva.Layer,
	clearHistory: () => void,
) {
	const router = useRouter();
	const store = useSpeedDrawStore();
	const timerStarted = ref(false);
	const isSpeedDraw = computed(() => store.theme !== null);

	function finish() {
		timer.stop();
		store.stopTimer();
		store.setCanvasDataURL(exportCanvas());
		timerStarted.value = false;
		router.push("/results");
	}

	const timer = useTimer(10 * 60, finish);

	// Start the timer on first stroke instead of immediately. Give the user some time.
	function onFirstStroke() {
		if (!isSpeedDraw.value || timerStarted.value) return;
		timerStarted.value = true;
		store.startTimer();
		timer.start();
	}

	watch(
		() => store.theme,
		(theme, prev) => {
			if (theme !== null && prev === null) {
				if (
					!confirm(
						"Starting SpeedDraw will clear your current canvas. Continue?",
					)
				) {
					store.reset();
					return;
				}
				getDrawLayer().destroyChildren();
				getDrawLayer().batchDraw();
				clearHistory();
			}
		},
	);

	return {
		isSpeedDraw,
		timerStarted,
		timer,
		onFirstStroke,
		finish,
		theme: computed(() => store.theme),
	};
}
