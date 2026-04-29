/* eslint-disable */
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			devTools: !app.isPackaged,
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	!app.isPackaged
		? win.loadURL("http://localhost:5173")
		: win.loadFile("dist/index.html");
}

app.whenReady().then(createWindow);
