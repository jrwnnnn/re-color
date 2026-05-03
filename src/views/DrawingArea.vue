<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useColorStore } from "@/stores/useColorStore";
import { usePaywallStore } from "@/stores/usePaywallStore";
import { useStage } from "@/lib/useStage";
import { useHistory } from "@/lib/useHistory";
import { useCanvas } from "@/lib/useCanvas";
import { useTools } from "@/lib/useTools";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import Toolbar from "@/components/ToolBar.vue";
import ColorBar from "@/components/ColorBar.vue";
import StatusBar from "@/components/StatusBar.vue";

const canvasStore = useCanvasStore();
const colorStore = useColorStore();
const paywallStore = usePaywallStore();

const rootRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();

const { init, destroy, getPos, getStage, getDrawLayer } =
	useStage(containerRef);
const { saveSnapshot, undo, redo, clearHistory } = useHistory(getDrawLayer);
const { newCanvas, exportCanvas } = useCanvas(
	getStage,
	getDrawLayer,
	clearHistory,
	containerRef,
);

const { handleMouseDown, handleMouseMove, handleMouseUp } = useTools(
	getDrawLayer,
	getPos,
	canvasStore,
	colorStore,
	paywallStore,
	saveSnapshot,
);
const { onKeyDown } = useKeyboardShortcuts(canvasStore);

const promoIndex = ref(0);
const promoCountdown = ref(45);
const coinBalance = ref(120);
const showPayment = ref(false);
const showCoinShop = ref(false);
const adSrc = ref("");
const adIndex = ref(-1);
const ads = ref<string[]>([]);
const adLabel = ref("Loading ads...");
const paymentReason = ref("Upgrade");

const promos = [
	"VIP Palette Pack - 60% off",
	"Brush Plus Pack - 2.99",
	"Export HD Unlocked - 700 coins",
	"Remove Ads (7 days) - 500 coins",
];

let promoRotationId: number | undefined;
let promoCountdownId: number | undefined;
let adRotationId: number | undefined;

const openPayment = (reason: string) => {
	paymentReason.value = reason;
	showPayment.value = true;
	showCoinShop.value = false;
	paywallStore.closeLightbox();
};

const closePayment = () => {
	showPayment.value = false;
};

const openCoinShop = () => {
	showCoinShop.value = true;
	paywallStore.closeLightbox();
};

const closeCoinShop = () => {
	showCoinShop.value = false;
};

const isAdFile = (name: string) => /\.(png|jpe?g|gif|webp)$/i.test(name);

const refreshAds = async () => {
	const list = await window.electronAPI?.listAds?.();
	if (!Array.isArray(list)) {
		ads.value = [];
		adLabel.value = "No ad support available";
		return;
	}
	ads.value = list
		.filter(isAdFile)
		.map((name) => `/ads/${encodeURIComponent(name)}`);
	adLabel.value = ads.value.length
		? `Ad ${adIndex.value + 2} of ${ads.value.length}`
		: "No ads in public/ads";
};

const showNextAd = async () => {
	await refreshAds();
	if (ads.value.length === 0) {
		adSrc.value = "";
		adLabel.value = "No ads in public/ads";
		return;
	}
	adIndex.value = (adIndex.value + 1) % ads.value.length;
	adSrc.value = ads.value[adIndex.value];
	adLabel.value = `Ad ${adIndex.value + 1} of ${ads.value.length}`;
};

onMounted(() => {
	rootRef.value!.focus();
	init();

	const stage = getStage();
	stage.on("mousedown touchstart", handleMouseDown);
	stage.on("mousemove touchmove", handleMouseMove);
	stage.on("mouseup touchend", handleMouseUp);

	window.electronAPI?.onUndo(() => undo());
	window.electronAPI?.onRedo(() => redo());

	window.electronAPI?.onNewCanvas(() => newCanvas());
	window.electronAPI?.onExport(async () => {
		const dataURL = exportCanvas();
		await window.electronAPI?.saveImage(dataURL);
	});

	void showNextAd();

	promoRotationId = window.setInterval(() => {
		promoIndex.value = (promoIndex.value + 1) % promos.length;
		promoCountdown.value = 45;
	}, 5000);

	promoCountdownId = window.setInterval(() => {
		if (promoCountdown.value > 0) {
			promoCountdown.value -= 1;
		}
	}, 1000);

	adRotationId = window.setInterval(() => {
		void showNextAd();
	}, 30000);
});

watch(
	() => colorStore.mode,
	(mode) => {
		document.querySelector(".pcr-app")?.setAttribute("data-mode", mode);
	},
	{ immediate: true },
);

onUnmounted(() => {
	if (promoRotationId) window.clearInterval(promoRotationId);
	if (promoCountdownId) window.clearInterval(promoCountdownId);
	if (adRotationId) window.clearInterval(adRotationId);
	destroy();
});
</script>

<template>
	<div
		ref="rootRef"
		class="bg-surface flex h-screen flex-col outline-none"
		tabindex="0"
		@keydown="onKeyDown"
	>
		<div class="flex min-h-0 flex-1 overflow-hidden">
			<Toolbar />
			<div
				class="bg-surface relative flex-1 overflow-hidden"
				:style="{ filter: colorStore.cssFilter }"
			>
				<div ref="containerRef" class="h-full w-full"></div>

				<div class="pointer-events-none absolute inset-0">
					<div
						class="annoy-banner pointer-events-auto absolute top-2 right-2 left-2 z-30 flex items-center justify-between gap-3 rounded-md px-3 py-2 text-xs"
					>
						<div class="flex items-center gap-2">
							<span
								class="annoy-pill text-xxs rounded px-1.5 py-0.5 font-semibold tracking-wide uppercase"
							>
								Limited
							</span>
							<p class="text-xs font-semibold">
								{{ promos[promoIndex] }}
							</p>
							<span class="text-xxs text-white/70">
								Ends in {{ promoCountdown }}s
							</span>
						</div>
						<div class="flex items-center gap-1.5">
							<button class="annoy-btn annoy-pulse" @click="openCoinShop">
								Get Coins
							</button>
							<button
								class="annoy-btn-secondary"
								@click="openPayment('Try Pro')"
							>
								Try Pro
							</button>
						</div>
					</div>

					<div
						v-if="paywallStore.lightboxVisible"
						class="annoy-lightbox pointer-events-auto absolute inset-0 z-40 flex items-center justify-center"
					>
						<div
							class="annoy-payment annoy-paywall-modal w-72 rounded-md p-3 text-xs"
						>
							<div class="flex items-center justify-between">
								<p
									class="text-xxs font-semibold tracking-wide text-white/80 uppercase"
								>
									Upgrade required
								</p>
								<button
									class="annoy-link"
									@click="paywallStore.closeLightbox()"
								>
									Not now
								</button>
							</div>
							<p class="text-xxs mt-1 text-white/70">
								Blocked: {{ paywallStore.lightboxReason }}
							</p>
							<div class="mt-2 flex flex-col gap-2">
								<button class="annoy-btn" @click="openPayment('Upgrade')">
									Upgrade now
								</button>
								<button class="annoy-btn-secondary" @click="openCoinShop">
									Get coins
								</button>
							</div>
						</div>
					</div>

					<div
						v-if="showPayment"
						class="annoy-lightbox pointer-events-auto absolute inset-0 z-50 flex items-center justify-center"
						@click.self="closePayment"
					>
						<div class="annoy-payment w-80 rounded-md p-3 text-xs">
							<div class="flex items-center justify-between">
								<p
									class="text-xxs font-semibold tracking-wide text-white/80 uppercase"
								>
									Checkout
								</p>
								<button class="annoy-link" @click="closePayment">Close</button>
							</div>
							<p class="text-xxs mt-1 text-white/60">
								Triggered by: {{ paymentReason }}
							</p>
							<div class="mt-2 flex flex-col gap-2">
								<input
									class="annoy-input"
									placeholder="Card number"
									type="text"
									maxlength="19"
									disabled
								/>
								<div class="flex gap-2">
									<input
										class="annoy-input"
										placeholder="MM/YY"
										type="text"
										maxlength="5"
										disabled
									/>
									<input
										class="annoy-input"
										placeholder="CVC"
										type="text"
										maxlength="4"
										disabled
									/>
								</div>
								<input
									class="annoy-input"
									placeholder="Name on card"
									type="text"
									disabled
								/>
								<div
									class="text-xxs flex items-center justify-between text-white/60"
								>
									<span>Order total: $7.99</span>
									<button class="annoy-link" disabled>Apply promo</button>
								</div>
								<button class="annoy-btn w-full" disabled>Pay now</button>
								<p class="text-xxs text-white/45">
									Payment processing unavailable.
								</p>
							</div>
						</div>
					</div>

					<div
						v-if="showCoinShop"
						class="annoy-lightbox pointer-events-auto absolute inset-0 z-50 flex items-center justify-center"
						@click.self="closeCoinShop"
					>
						<div class="annoy-shop w-72 rounded-md p-3 text-xs">
							<div class="text-xxs flex items-center justify-between">
								<p class="font-semibold tracking-wide text-white/80 uppercase">
									Coin Shop
								</p>
								<button class="annoy-link" @click="closeCoinShop">Close</button>
							</div>
							<p class="text-xxs mt-1 text-white/60">
								Balance: {{ coinBalance }}
							</p>
							<div class="mt-2 grid grid-cols-2 gap-2">
								<button class="annoy-tile" @click="openPayment('120 coins')">
									120
									<span class="text-xxs text-white/60">$0.99</span>
								</button>
								<button class="annoy-tile" @click="openPayment('650 coins')">
									650
									<span class="text-xxs text-white/60">$3.99</span>
								</button>
								<button class="annoy-tile" @click="openPayment('1500 coins')">
									1500
									<span class="text-xxs text-white/60">$7.99</span>
								</button>
								<button class="annoy-tile" @click="openPayment('2600 coins')">
									2600
									<span class="text-xxs text-white/60">$11.99</span>
								</button>
							</div>
							<div class="text-xxs mt-2 flex items-center justify-between">
								<span class="text-white/60">Best value: 2600</span>
								<button class="annoy-link" @click="openPayment('Restore')">
									Restore
								</button>
							</div>
						</div>
					</div>

					<div
						class="annoy-ad-backdrop pointer-events-none fixed inset-x-0 bottom-0 z-50"
					>
						<div class="annoy-ad-dock pointer-events-none">
							<div
								class="text-xxs flex items-center justify-between gap-2 px-2 py-1 text-white/70"
							>
								<span class="font-semibold tracking-wide uppercase"
									>Sponsored</span
								>
								<span>{{ adLabel }}</span>
							</div>
							<div class="annoy-ad-frame">
								<img
									v-if="adSrc"
									class="annoy-ad-image"
									:src="adSrc"
									alt="Sponsored ad"
								/>
								<div v-else class="annoy-ad-empty">
									No ads found in public/ads
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<ColorBar />
		<StatusBar />
	</div>
</template>
