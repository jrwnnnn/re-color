/* eslint-disable */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	onNewCanvas: (callback) => ipcRenderer.on("menu:new-canvas", callback),
	onExport: (callback) => ipcRenderer.on("menu:export", callback),
	saveImage: (dataURL) => ipcRenderer.invoke("save-image", dataURL),
	onUndo: (callback) => ipcRenderer.on("menu:undo", callback),
	onRedo: (callback) => ipcRenderer.on("menu:redo", callback),
});
