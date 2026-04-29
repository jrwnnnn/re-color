/* eslint-disable */
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			devTools: !app.isPackaged,
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	if (!app.isPackaged) {
		window.loadURL("http://localhost:5173");
	} else {
		window.loadFile("dist/index.html");
	}
}

app.whenReady().then(createWindow);
