import { createRouter, createWebHashHistory } from "vue-router";
import DrawingArea from "@/views/DrawingArea.vue";
import ResultsScreen from "@/views/ResultsScreen.vue";
import AboutRecolor from "@/views/AboutRecolor.vue";

export const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/", component: DrawingArea },
		{ path: "/results", component: ResultsScreen },
		{ path: "/about", component: AboutRecolor },
	],
});
