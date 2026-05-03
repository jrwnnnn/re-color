import { ref, computed, onUnmounted } from "vue";

export function useTimer(durationSeconds: number, onEnd: () => void) {
	const remaining = ref(durationSeconds);
	let interval: ReturnType<typeof setInterval> | null = null;

	function start() {
		interval = setInterval(() => {
			remaining.value--;
			if (remaining.value <= 0) {
				stop();
				onEnd();
			}
		}, 1000);
	}

	function stop() {
		if (interval) clearInterval(interval);
		interval = null;
	}

	const formatted = computed(() => {
		const m = Math.floor(remaining.value / 60)
			.toString()
			.padStart(2, "0");
		const s = (remaining.value % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	});

	onUnmounted(stop);

	return { remaining, formatted, start, stop };
}
