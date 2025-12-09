const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('app:ping'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});

