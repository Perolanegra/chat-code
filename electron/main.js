const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // sem borda - frameless
    transparent: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:4200');
  } else {
    win.loadFile(path.join(__dirname, '../dist/chat-code/browser/index.html'));
  }

  // Exemplo: abrir links externos no browser padrão
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Exemplo simples de IPC (se precisar de comunicação)
ipcMain.handle('app:ping', async () => 'pong');

// Handlers para controles de janela
ipcMain.handle('window:minimize', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  win.minimize();
});

ipcMain.handle('window:toggle-max', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
});

ipcMain.handle('window:close', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  win.close();
});
