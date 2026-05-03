// TODO: Need to expand this list.
const THEMES = [
	"Under the Sea",
	"Enchanted Forest",
	"Space Station",
	"Rainy City",
	"Ancient Ruins",
	"Desert at Sunset",
	"Neon Tokyo",
	"Arctic Expedition",
	"Jungle Temple",
	"Cozy Cabin",
];

export function pickRandomTheme(exclude?: string): string {
	const pool = exclude ? THEMES.filter((t) => t !== exclude) : THEMES;
	return pool[Math.floor(Math.random() * pool.length)];
}
