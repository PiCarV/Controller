const {
  app,
  BrowserWindow,
  screen: electronScreen,
  ipcMain,
  electron,
  dialog,
} = require('electron');
const fs = require('fs');
const isDev = require('electron-is-dev');
const path = require('path');
const Store = require('electron-store');
var request = require('request');
var MjpegConsumer = require('mjpeg-consumer');
var FileOnWrite = require('file-on-write');
var Limiter = require('write-limiter');

Store.initRenderer();

let mainWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
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

ipcMain.on('selectDirectory', async function () {
  console.log('selectDirectory');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  mainWindow.webContents.send('selectedDirectory', result.filePaths[0]),
    console.log(result.filePaths[0]);
});

let recording = false;
let req = null;
let steeringAngle = 90;
let csvStream = null;

ipcMain.on('steering', function (e, msg) {
  steeringAngle = msg;
});

ipcMain.on('recording', function (e, msg) {
  recording = msg[0];
  if (recording) {
    console.log('recording', msg[0]);
    csvStream = fs.createWriteStream(msg[1] + '/steeringData.csv', {
      flags: 'a',
    });

    let writer = new FileOnWrite({
      path: msg[1],
      ext: '.jpg',
      // we abuse the filename function to write the steering angle at the same time the image is written
      filename: function (data) {
        console.log('filename', data);
        // @ts-ignore
        csvStream.write(steeringAngle + ',\n');
        return Date.now();
      },
    });

    let limiter = new Limiter(msg[3]);

    let consumer = new MjpegConsumer();

    req = request
      .get('http://' + msg[2] + ':8080/?action=stream')
      .pipe(consumer)
      .pipe(limiter)
      .pipe(writer)
      .on('error', function (err) {
        console.log('error', err);
      })
      .on('close', function () {
        console.log('closing stream');
      })
      .on('write', function (chunk, enc, cb) {
        console.log('writing chunk');
      });
  } else {
    console.log('recording', msg[0]);
    console.log(req);

    if (req) {
      // @ts-ignore
      req.emit('close');
    }
  }
});
