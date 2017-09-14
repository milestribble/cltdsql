const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const queries = require('./queries')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 6050 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(message)
    ws.send('something');
  });
});

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.toggleDevTools();
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

queries.show_table('tasks').then((data)=>console.log(data)).catch(err=>console.log(4,err))
