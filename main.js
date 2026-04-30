/* eslint-disable */
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
	const win = new BrowserWindow({
		minWidth: 900,
		minHeight: 600,
		webPreferences: {
			devTools: !app.isPackaged,
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	win.maximize();

	const menu = Menu.buildFromTemplate([
		{
			label: "File",
			submenu: [
				{
					label: "New",
					accelerator: "CmdOrCtrl+N",
					click: () => win.webContents.send("menu:new-painting"),
				},
				{ type: "separator" },
				{ role: "quit" },
			],
		},
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ type: "separator" },
				{ role: "resetZoom" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ role: "togglefullscreen" },
			],
		},
		{
			label: "Help",
			submenu: [
				{
					label: "Report an Issue",
				},
				{
					label: "About Re:Color",
				},
			],
		},
	]);
	Menu.setApplicationMenu(menu);

	!app.isPackaged
		? win.loadURL("http://localhost:5173")
		: win.loadFile(path.join(__dirname, "dist/index.html"));
}

app.whenReady().then(createWindow);
