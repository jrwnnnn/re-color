<script setup lang="ts">
import { router } from "@/router";
</script>

<template>
	<div
		class="flex h-screen w-screen items-center justify-center bg-linear-to-br from-pink-500/10 via-transparent to-violet-500/10"
	>
		<div class="flex gap-5 rounded-lg p-10">
			<div class="space-y-2">
				<p
					class="text-muted cursor-pointer hover:text-white/50"
					@click="router.push('/')"
				>
					Go back
				</p>
				<div class="flex justify-between">
					<span class="flex items-end gap-3">
						<p class="text-4xl font-bold">Re:Color</p>
						<p class="text-muted text-lg">v1.0.0</p>
					</span>
				</div>
				<p class="text-white/80">
					A paint app for people with color-vision difficulties.
				</p>
				<div class="mt-10 flex gap-5">
					<a
						href="https://github.com/jrwnnnn/re-color"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src="@/assets/github.png" class="h-7 w-7 invert" />
					</a>
					<a
						href="https://github.com/jrwnnnn/re-color/issues"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src="@/assets/bug.png" class="h-7 w-7 invert" />
					</a>
				</div>
			</div>
		</div>
	</div>
</template>
