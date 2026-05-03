import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Tool } from "@/stores/useCanvasStore";

const LOCKED_SWATCH_INDICES = new Set([
	4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
]);
const LOCKED_TOOLS = new Set<Tool>(["line", "rect", "circle"]);
const LOCKED_COLOR_MODES = new Set(["normal", "protanopia", "tritanopia"]);
const FREE_ERASER_SECONDS = 5;
const ERASER_COOLDOWN_SECONDS = 60;

export const usePaywallStore = defineStore("paywall", () => {
	const isPro = ref(false);
	const nagMessage = ref("");
	const nagVisible = ref(false);
	const nagCount = ref(0);
	const eraserSecondsRemaining = ref(FREE_ERASER_SECONDS);
	const eraserCooldownRemaining = ref(0);
	const lightboxVisible = ref(false);
	const lightboxReason = ref("Upgrade");
	const lightboxCount = ref(0);

	let nagTimeoutId: number | undefined;
	let eraserDrainId: number | undefined;
	let eraserCooldownId: number | undefined;

	const isPickerLocked = computed(() => !isPro.value);
	const isEraserLocked = computed(
		() =>
			!isPro.value &&
			(eraserCooldownRemaining.value > 0 || eraserSecondsRemaining.value <= 0),
	);

	function isToolLocked(tool: Tool) {
		return !isPro.value && LOCKED_TOOLS.has(tool);
	}

	function isSwatchLocked(index: number) {
		return !isPro.value && LOCKED_SWATCH_INDICES.has(index);
	}

	function isModeLocked(mode: string) {
		return !isPro.value && LOCKED_COLOR_MODES.has(mode);
	}

	function openLightbox(reason: string) {
		lightboxReason.value = reason;
		lightboxVisible.value = true;
		lightboxCount.value += 1;
	}

	function closeLightbox() {
		lightboxVisible.value = false;
	}

	function triggerNag(message: string) {
		nagMessage.value = message;
		nagVisible.value = true;
		nagCount.value += 1;
		if (nagTimeoutId) window.clearTimeout(nagTimeoutId);
		nagTimeoutId = window.setTimeout(() => {
			nagVisible.value = false;
		}, 3500);
	}

	function startEraserCooldown() {
		if (isPro.value || eraserCooldownId) return;
		eraserCooldownRemaining.value = ERASER_COOLDOWN_SECONDS;
		triggerNag("Eraser timeout. Upgrade to Pro to erase more.");
		openLightbox("Eraser timed out");

		eraserCooldownId = window.setInterval(() => {
			if (eraserCooldownRemaining.value > 0) {
				eraserCooldownRemaining.value -= 1;
			}
			if (eraserCooldownRemaining.value <= 0) {
				window.clearInterval(eraserCooldownId);
				eraserCooldownId = undefined;
				eraserSecondsRemaining.value = FREE_ERASER_SECONDS;
			}
		}, 1000);
	}

	function startEraserUse() {
		if (isPro.value) return true;
		if (isEraserLocked.value) {
			triggerNag("Eraser locked. Buy Pro to erase more.");
			openLightbox("Eraser locked");
			return false;
		}
		if (eraserDrainId) return true;

		eraserDrainId = window.setInterval(() => {
			if (isPro.value) {
				stopEraserUse();
				return;
			}
			if (eraserSecondsRemaining.value > 0) {
				eraserSecondsRemaining.value -= 1;
			}
			if (eraserSecondsRemaining.value <= 0) {
				stopEraserUse();
				startEraserCooldown();
			}
		}, 1000);

		return true;
	}

	function stopEraserUse() {
		if (!eraserDrainId) return;
		window.clearInterval(eraserDrainId);
		eraserDrainId = undefined;
	}

	return {
		isPro,
		nagMessage,
		nagVisible,
		nagCount,
		eraserSecondsRemaining,
		eraserCooldownRemaining,
		lightboxVisible,
		lightboxReason,
		lightboxCount,
		isPickerLocked,
		isEraserLocked,
		isToolLocked,
		isSwatchLocked,
		isModeLocked,
		triggerNag,
		openLightbox,
		closeLightbox,
		startEraserUse,
		stopEraserUse,
	};
});
