const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // File system and paths
  openPath: (filePath) => ipcRenderer.send('open-path', filePath),
  readPdfFile: (filePath) => ipcRenderer.invoke('read-pdf-file', filePath),

  // PDF event listeners (with cleanup function to prevent memory leaks)
  onOpenPdf: (callback) => {
    const subscription = (event, filePath) => callback(filePath);
    ipcRenderer.on('open-pdf-file', subscription);

    // Returns a cleanup function for useEffect / component unmounting
    return () => {
      ipcRenderer.removeListener('open-pdf-file', subscription);
    };
  },
});