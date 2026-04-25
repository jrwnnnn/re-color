const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		nodeIntegration: false,
		contextIsolation: true,
		webPreferences: {
			devTools: !app.isPackaged,
		},
	});

	if (!app.isPackaged) {
		window.loadURL("http://localhost:5173");
	} else {
		window.loadFile(path.join(__dirname, "dist/index.html"));
	}
}

app.whenReady().then(createWindow);
