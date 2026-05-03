import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	timeout: 30000,
	webServer: {
		command: "vite",
		port: 5173,
		reuseExistingServer: false,
	},
	use: {
		baseURL: "http://localhost:5173",
	},
});
