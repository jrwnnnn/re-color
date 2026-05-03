<script setup lang="ts">
import { onMounted } from "vue";
import { useSpeedDrawStore } from "@/stores/useSpeedDrawStore";
import { pickRandomTheme } from "@/lib/themes";

const store = useSpeedDrawStore();

onMounted(() => {
	window.electronAPI?.onStartSpeedDraw(() => {
		store.reset();
		store.setTheme(pickRandomTheme());
	});
});
</script>

<template>
	<RouterView />
</template>