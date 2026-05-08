/* eslint-disable */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	onNewCanvas: (callback) => ipcRenderer.on("menu:new-canvas", callback),
	onStartSpeedDraw: (callback) => ipcRenderer.on("menu:speeddraw", callback),
	setSpeedDrawActive: (isActive) =>
		ipcRenderer.send("speeddraw:set-active", isActive),
	onExport: (callback) => ipcRenderer.on("menu:export", callback),
	setExportVisible: (visible) =>
		ipcRenderer.send("export:set-visible", visible),
	saveImage: (dataURL) => ipcRenderer.invoke("save-image", dataURL),
	onUndo: (callback) => ipcRenderer.on("menu:undo", callback),
	onRedo: (callback) => ipcRenderer.on("menu:redo", callback),
	moveToAbout: (callback) => ipcRenderer.on("menu:about", callback),
});
