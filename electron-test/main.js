// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog, Notification, globalShortcut, MenuItem, Menu}  = require('electron')
const path = require('path')
const channels = require("./constants")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let notification 

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  mainWindow.setIcon('./ipl_logo.jpg', 'Overlay description')

  // and load the index.html of the app.
  mainWindow.loadFile("../web3-2019-webapp-week_7/build/index.html")

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('close', (e) =>  {
    quitApp(e)
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

const quitApp = (e) => {
  let index = dialog.showMessageBoxSync(mainWindow, {
    type: "question",
    title: "Vous êtes sur le point de quitter l'application",
    message: "Etes vous sur de vouloir quitter ?",
    buttons: [
      "Non", "Oui"
    ],

  })
  if(index === 0){
    e.preventDefault()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const ret = globalShortcut.register('CommandOrControl+C', () => {
    app.quit()
  })
  if(!ret){
    console.log('registration failed')
  }
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})


app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

ipcMain.on(channels.QuotesChannel, (e, arg) => {
  notification = new Notification()
  notification.title = "Quotes"
  notification.body = arg
  notification.show()
  notification.on("click", () => {
    e.reply(channels.QuotesChannel, { author: "Notification", message: "Il était temps de me clicker dessus !" })
  })
})

ipcMain.on(channels.GalleryChannel, (e, arg) => {
  notification = new Notification()
  notification.title = "Gallery"
  notification.body = arg
  notification.show()

})

ipcMain.on(channels.WebStatus, (e, arg) => {
  notification = new Notification()
  notification.title = "Etat du réseau"
  notification.body = "La connection internet est passé " + arg
  notification.show()
})

ipcMain.on(channels.GalleryUploadProgressBar, (e, arg) => {
  console.log("Progress : ", arg)
  mainWindow.setProgressBar(arg)
})

const menu = Menu.buildFromTemplate([
  {
    label:"Quitter",
    submenu:[
      {
        label:"Fermer l'app",
        accelerator:"CmdOrCtrl+Q",
        click:() => {
          mainWindow = null;
          app.quit();
        }
      }
    ]
  }
])

Menu.setApplicationMenu(menu)
