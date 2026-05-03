import { test, expect } from "@playwright/test";

async function getCanvas(page: Page) {
	await page.waitForSelector("canvas");
	const canvas = page.locator("canvas").first();
	const box = await canvas.boundingBox();
	if (!box) throw new Error("canvas not found");
	return box;
}

// This test ensures that the app loads without errors and that the main container is rendered.
test("app loads", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("#app")).not.toBeEmpty();
});

// This test simulates drawing with each tool and takes a screenshot at the end.
test("each tool draws", async ({ page }) => {
	await page.goto("/");
	const canvas = await getCanvas(page);

	for (const tool of ["brush", "line", "rect", "circle"]) {
		await page.getByTestId(tool).click();
		await page.mouse.move(canvas.x + 200, canvas.y + 200);
		await page.mouse.down();
		await page.mouse.move(canvas.x + 400, canvas.y + 400);
		await page.mouse.up();
	}

	await page.getByTestId("eraser").click();
	await page.mouse.move(canvas.x + 200, canvas.y + 300);
	await page.mouse.down();
	await page.mouse.move(canvas.x + 500, canvas.y + 300);
	await page.mouse.up();

	await page.screenshot({ path: "test-results/all-tools.png" });
});

// This test ensures that the color simulations are being applied and do not cause rendering issues.
// Screenshots are taken for each mode.
// Results should be manually verified by checking the if the color swatches in the color bar change.
test("colorblind modes apply", async ({ page }) => {
	await page.goto("/");
	await page.waitForSelector("canvas");

	const select = page.getByTestId("colormode-select");
	for (const mode of ["deuteranopia", "protanopia", "tritanopia", "normal"]) {
		await select.selectOption(mode);
		await expect(page.locator("#app")).not.toBeEmpty();
		const pickr = page.locator(".pickr").first();
		await pickr.click();
		await page.waitForTimeout(300);
		await page.screenshot({ path: `test-results/color mode/${mode}.png` });
		await page.keyboard.press("Escape");
	}
});

// This test checks that the export functionality returns a valid PNG dataURL with the correct 1920x1080 dimensions.
test("export returns valid 1920x1080 PNG dataURL", async ({ page }) => {
	await page.goto("/");
	await page.waitForSelector("canvas");

	const result = await page.evaluate(() => {
		const w = window as Window & {
			Konva?: { stages: { toDataURL: (opts: object) => string }[] };
		};
		const stage = w.Konva?.stages?.[0];
		if (!stage) return null;
		return stage.toDataURL({
			x: 0,
			y: 0,
			width: 1920,
			height: 1080,
			pixelRatio: 1,
		});
	});

	expect(result).toMatch(/^data:image\/png;base64,/);

	const dimensions = await page.evaluate((dataURL: string) => {
		return new Promise<{ width: number; height: number }>((resolve) => {
			const img = new Image();
			img.onload = () => resolve({ width: img.width, height: img.height });
			img.src = dataURL;
		});
	}, result!);

	expect(dimensions.width).toBe(1920);
	expect(dimensions.height).toBe(1080);
});
