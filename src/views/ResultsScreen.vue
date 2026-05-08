<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useSpeedDrawStore } from "@/stores/useSpeedDrawStore";
import { toPng } from "html-to-image";

const router = useRouter();
const store = useSpeedDrawStore();
const resultsRef = ref<HTMLDivElement>();

const elapsed = computed(() => {
	const s = store.elapsedSeconds;
	const m = Math.floor(s / 60)
		.toString()
		.padStart(2, "0");
	const sec = (s % 60).toString().padStart(2, "0");
	return `${m}:${sec}`;
});

function savePainting() {
	if (!store.canvasDataURL) return;
	const a = document.createElement("a");
	a.href = store.canvasDataURL;
	a.download = `speeddraw.png`;
	a.click();
}

async function saveResult() {
	if (!resultsRef.value) return;
	const dataURL = await toPng(resultsRef.value);
	const a = document.createElement("a");
	a.href = dataURL;
	a.download = `speeddraw-result.png`;
	a.click();
}

function continueDrawing() {
	store.setTheme(null);
	router.push("/");
}

// Prevent browser back button from returning to the drawing area.
// User must explicitly click Continue Drawing or close.
function preventBack() {
	history.pushState(null, "", location.href);
}

onMounted(() => {
	history.pushState(null, "", location.href);
	window.addEventListener("popstate", preventBack);
	window.electronAPI?.moveToAbout(() => {
		router.push("/about");
	});
});

onUnmounted(() => {
	window.removeEventListener("popstate", preventBack);
});
</script>

<template>
	<div
		class="bg-surface flex h-screen flex-col items-center justify-center overflow-auto py-10 text-white"
	>
		<div
			ref="resultsRef"
			class="bg-surface flex w-full max-w-3xl flex-col items-center gap-8 px-8 py-8"
			s
		>
			<div class="flex w-full items-center justify-between">
				<div class="flex w-full items-center gap-3">
					<img
						src="@/assets/re-color.png"
						alt="Re:Color"
						class="h-8 object-contain"
					/>
					<div class="flex flex-col gap-0.5">
						<p class="text-muted text-xs tracking-widest uppercase">
							Re:Color SpeedDraw
						</p>
						<p class="text-sm font-semibold">{{ store.theme }}</p>
					</div>
				</div>
				<div class="flex flex-col items-end">
					<p class="text-muted text-xs tracking-widest uppercase">Time</p>
					<p class="font-light">{{ elapsed }}</p>
				</div>
			</div>

			<div class="border-accent w-full overflow-hidden rounded-lg border">
				<img
					v-if="store.canvasDataURL"
					:src="store.canvasDataURL"
					alt="Your painting"
					class="w-full object-contain"
				/>
			</div>
		</div>
		<div class="mt-8 flex items-center gap-3">
			<button
				@click="savePainting"
				class="border-accent hover:bg-panel cursor-pointer rounded-sm border px-5 py-2 text-sm"
			>
				Save Painting
			</button>
			<button
				@click="saveResult"
				class="border-accent hover:bg-panel cursor-pointer rounded-sm border px-5 py-2 text-sm"
			>
				Save Result
			</button>
			<button
				@click="continueDrawing"
				class="bg-highlight hover:bg-highlight/90 cursor-pointer rounded-sm px-5 py-2 text-sm font-bold"
			>
				Continue Drawing
			</button>
		</div>
	</div>
</template>
