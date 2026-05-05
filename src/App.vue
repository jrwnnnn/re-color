<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useSpeedDrawStore } from "@/stores/useSpeedDrawStore";
import { pickRandomTheme } from "@/lib/themes";
import { useRoute } from "vue-router";

const store = useSpeedDrawStore();
const route = useRoute();

onMounted(() => {
	window.electronAPI?.onStartSpeedDraw(() => {
		store.reset();
		store.setTheme(pickRandomTheme());
	});
});

watch(
	() => route.path,
	(path) => {
		window.electronAPI?.setExportVisible(path !== "/results");
	},
	{ immediate: true },
);
</script>

<template>
	<RouterView />
</template>
