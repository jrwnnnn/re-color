/* eslint-disable */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	onNewPainting: (callback) => ipcRenderer.on("menu:new-painting", callback),
});
