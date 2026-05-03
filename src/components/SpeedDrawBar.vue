<script setup lang="ts">
defineProps<{
	theme: string;
	formatted: string;
	remaining: number;
	started: boolean;
}>();

defineEmits<{ finish: [] }>();
</script>

<template>
	<div
		class="bg-panel border-accent flex items-center justify-between border-b px-3 py-1.5 text-xs"
	>
		<div class="flex items-center gap-2">
			<p class="text-highlight font-bold tracking-widest">SPEEDDRAW</p>
			<p class="text-muted font-bold">·</p>
			<p class="tracking-wide">Theme: {{ theme }}</p>
		</div>
		<div class="flex items-center gap-4">
			<span
				:class="
					!started
						? 'text-white/30'
						: remaining < 60
							? 'text-red-400'
							: 'text-white/60'
				"
			>
				{{ started ? formatted : "15:00" }}
			</span>
			<button
				@click="$emit('finish')"
				class="border-accent text-muted cursor-pointer rounded border px-3 py-px transition-colors hover:border-white hover:text-white"
			>
				Done
			</button>
		</div>
	</div>
</template>
