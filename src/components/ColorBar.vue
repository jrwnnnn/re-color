<script setup lang="ts">
import { useColorStore, PALETTE } from "@/stores/useColorStore";
import colorNamer from "color-namer";
const colorStore = useColorStore();
</script>

<template>
	<div
		class="bg-panel border-accent flex items-center gap-2.5 border-t  py-1 px-2"
	>
		<input
			id="custom-color-picker"
			title="Custom Color Picker"
			type="color"
			:value="colorStore.activeColor"
			@input="colorStore.setColor(($event.target as HTMLInputElement).value)"
			class="h-10 w-10 cursor-pointer"
		/>

		<div class="flex flex-wrap items-center gap-1">
			<button
				v-for="color in PALETTE"
				:key="color.hex"
				@click="colorStore.setColor(color.hex)"
				:title="colorNamer(color.hex).ntc[0].name + ' (' + color.hex + ')'"
				:class="[
					'h-6 w-6 cursor-pointer border-2 transition-all duration-100',
					colorStore.activeColor.toLowerCase() === color.hex.toLowerCase()
						? 'border-highlight scale-110'
						: 'border-transparent hover:scale-110 hover:border-white/40',
				]"
				:style="{ background: color.hex }"
			></button>
		</div>
	</div>
</template>
