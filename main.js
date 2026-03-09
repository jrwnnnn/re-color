// TODO: Add app icon

import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
// import path from "path";
// import { fileURLToPath } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
const loadURL = serve({ directory: "dist" });

let window;

async function createWindow() {
  window = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload: path.join(__dirname, 'preload.js')
      devTools: !app.isPackaged,
    },
  });

  if (!app.isPackaged) {
    await window.loadURL("http://localhost:4321");
    window.webContents.openDevTools();
  } else {
    await loadURL(window);
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
