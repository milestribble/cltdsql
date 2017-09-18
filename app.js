const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const queries = require('./queries')
const express = require('express')
const bodyParser = require('body-parser');
const routes = express()

routes.use(bodyParser.json())

routes.post('/add', function(req, res){
  queries.add_task(req.body).then((data)=>{console.log(data);return data}).then((data)=>res.json(data)).catch(err=>console.log('new_task',err))
})

routes.post('/change', function(req, res){
  queries.change(req.body).then((data)=>{console.log(data);return data}).then((data)=>res.json(data)).catch(err=>console.log('change_task',err))
})

routes.post('/refresh', function(req, res){
  queries.refresh().then((data)=>{console.log(data);return data}).then((data)=>res.json(data)).catch(err=>console.log('change_task',err))
})

routes.post('/load', function(req, res){
  queries.load().then((data)=>{console.log(data);return data}).then((data)=>res.json(data)).catch(err=>console.log('load',err))
})


routes.post('/remove_task', function(req, res){
  queries.remove_task(req.body).then((data)=>{console.log(data);return data}).then((data)=>res.json(data)).catch(err=>console.log('delete_task',err))
})
  // req.body.savestatus //{ savestatus: 'unsaved', task_entry: '', task_id: 'db_id' }
  //

routes.listen(6050)
// const WebSocket = require('ws')

// const wss = new WebSocket.Server({ port: 6050 });
//
// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log(message)
//     ws.send('something');
//   });
// });

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // win.toggleDevTools();
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
