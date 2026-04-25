const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			devTools: !app.isPackaged,
		},
	});

	if (!app.isPackaged) {
		window.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		window.loadFile(path.join(__dirname, "dist/index.html"));
	}
}

app.whenReady().then(createWindow);
