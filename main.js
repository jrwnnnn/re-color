/* eslint-disable */
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
	const win = new BrowserWindow({
		minWidth: 900,
		minHeight: 600,
		icon: path.join(__dirname, "dist/icon.ico"),
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
					accelerator: "Ctrl+N",
					click: () => win.webContents.send("menu:new-canvas"),
				},
				{
					label: "SpeedDraw",
					click: () => win.webContents.send("menu:speeddraw"),
				},
				{
					label: "Export",
					accelerator: "Ctrl+S",
					click: () => win.webContents.send("menu:export"),
				},
				{ type: "separator" },
				{ role: "quit" },
			],
		},
		{
			label: "Edit",
			submenu: [
				{
					label: "Undo",
					accelerator: "Ctrl+Z",
					click: () => win.webContents.send("menu:undo"),
				},
				{
					label: "Redo",
					accelerator: "Ctrl+Y",
					click: () => win.webContents.send("menu:redo"),
				},
			],
		},
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				...(!app.isPackaged ? [{ role: "toggleDevTools" }] : []),
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

ipcMain.handle("save-image", async (_, dataURL) => {
	const { filePath, canceled } = await dialog.showSaveDialog({
		defaultPath: "painting.png",
		filters: [{ name: "PNG Image", extensions: ["png"] }],
	});
	if (canceled || !filePath) return;
	const base64 = dataURL.replace(/^data:image\/png;base64,/, "");
	fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
});
