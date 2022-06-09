const {
  app,
  BrowserWindow,
  screen: electronScreen,
  ipcMain,
} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const Store = require('electron-store');

Store.initRenderer();

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      devTools: isDev,
    },
  });
  const startURL = isDev
    ? 'http://localhost:8080'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  // if we are in production remove the menu bar
  if (!isDev) {
    mainWindow.setMenu(null);
  }

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
