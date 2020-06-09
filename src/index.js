'use strict';

const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const isFile = (file) => {
  try {
    return fs.statSync(file).isFile();
  } catch (e) {
    return false;
  }
};

const _ENV = process.env;
const _DIR = __dirname;
const _FILE = __filename;

const appFiles = {
    mainDir: path.join(_DIR,".."),
    logsDir: path.join(_DIR,"../logs"),
    electronIcon: path.join(_DIR,"../assets/favicon.ico"),
    electronBrowser: path.join(_DIR,"../assets/browser.html"),
    electronWorker: path.join(_DIR,"../assets/worker.html"),
    preload: path.join(_DIR,"./preload.js"),
    nedb: path.join(_DIR,"./nedb.js"),
    savefiles: path.join(_DIR,"./savefiles.js"),
    common: path.join(_DIR,"./lib/common.js"),
    config: path.join(_DIR,"./lib/config.js"),
};

const common = require(appFiles.common);
const config = require(appFiles.config).settings;
config.delay = parseInt(config.delay);
config.uri = (!common.empty(config.uri))?config.uri:'https://it-minsk.by';
config.file = (!common.empty(appFiles.electronBrowser) && isFile(appFiles.electronBrowser))?appFiles.electronBrowser:path.join(_DIR,'index.html');
config.icon = (!common.empty(appFiles.electronIcon) && isFile(appFiles.electronIcon))?appFiles.electronIcon:path.join(_DIR,'favicon.ico');

var mainWindow, workerWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup') && app && 'quit' in app) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  try {
    var gotTitle = false, timerId = 0;
    // app.getPath - папка пользователя ОС

    // Create the browser window.
    mainWindow = new BrowserWindow({
      show: false,
      width: 1200,
      height: 700,
      resizable: true,
      fullscreen: false,
      autoHideMenuBar: true,
      kiosk: false,
      backgroundColor: '#fff',
      icon: config.icon,
      webPreferences: { // nodejs functionality as chrome ext
        //nodeIntegration: true,
        //preload: appFiles.preload
      }
    });
    var mainContents = mainWindow.webContents;

    mainWindow.once('ready-to-show', () => {
      //mainWindow.show();
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
      if (process.platform !== 'darwin') app.quit();
    });

    // зарегим клавищу Esc на закрытие приложения
    if (globalShortcut && config.escapeRegister) {
      globalShortcut.register('Escape', () => {
        app.quit();
      });
      globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
      });
    }

    mainContents.on('dom-ready', () => {
      // сработает даже если сайт не открылся
      let currURL = mainContents.history.pop();
      if (config.debug) console.log(`load attempt: ${currURL}`);
      if (!gotTitle) timerId = setTimeout(loadLocal, config.delay);
      else {
        if (currURL.indexOf(config.uri)<0) {
          // got local file loaded
          if (config.debug) console.log(`loaded local: ${currURL}`);
          // Open the DevTools
          if (config.debug) mainWindow.webContents.openDevTools();
        }
      }
      if (config.debug) console.log(`gotTitle = `, gotTitle);
    });

    mainContents.on('page-title-updated', (event, title) => {
      // сработает только если загрузился сайт и его title
      if (config.debug) console.log(`title = `, title);
      if (!common.empty(title)) {
        gotTitle = true;
        if (timerId) clearTimeout(timerId);
        mainWindow.show();
      }
    });

    var loadRemote = () => {
      if (config.debug) console.log(`loading remote!`);
      mainWindow.loadURL(config.uri);
    };

    var loadLocal = () => {
      if (config.debug) console.log(`loading local!`);
      mainWindow.loadURL(config.file);
    };

    loadRemote();

  } catch (e) { console.error(`createWindow() error: "${e}"`); }
};


var Main = () => {
  try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0 || mainWindow == null) {
        createWindow();
      }
    });

    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and import them here.

  } catch (e) { console.error(`Main() error: "${e}"`); }
};

Main();
