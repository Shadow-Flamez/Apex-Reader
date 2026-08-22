import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let initialPdfPath = null;

// Helper function to extract PDF path from command-line arguments (Windows/Linux)
function getPdfPathFromArgs(args) {
  if (!Array.isArray(args)) return null;
  const pdfArg = args.find((arg) => typeof arg === 'string' && arg.toLowerCase().endsWith('.pdf'));
  return pdfArg || null;
}

// macOS: Handles opening files via Finder or drag-and-drop onto app icon
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  initialPdfPath = filePath;

  if (mainWindow && mainWindow.webContents && !mainWindow.webContents.isLoading()) {
    mainWindow.webContents.send('open-pdf-file', filePath);
  }
});

// Single Instance Lock: Prevents opening multiple app windows when double-clicking PDFs
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      const openedPath = getPdfPathFromArgs(commandLine);
      if (openedPath) {
        mainWindow.webContents.send('open-pdf-file', openedPath);
      }
    }
  });

  app.whenReady().then(() => {
    // Catch PDF path if app was launched by double-clicking a PDF on Windows/Linux
    const launchPath = getPdfPathFromArgs(process.argv);
    if (launchPath) {
      initialPdfPath = launchPath;
    }

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,               // Removes standard OS title bar
    backgroundColor: '#1e1e1e',   // Prevents flashing white on startup
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Removes default menu strip
  mainWindow.removeMenu();

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Send initial PDF path once frontend finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    if (initialPdfPath) {
      mainWindow.webContents.send('open-pdf-file', initialPdfPath);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window control IPC Handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

// File path handlers
ipcMain.on('open-path', (event, filePath) => {
  if (filePath) {
    shell.openPath(filePath);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});