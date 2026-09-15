import { createRouter, createWebHashHistory } from "vue-router";
import DrawingArea from "@/views/DrawingArea.vue";
import AboutRecolor from "@/views/AboutRecolor.vue";

export const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/", component: DrawingArea },
		{ path: "/about", component: AboutRecolor },
	],
});
