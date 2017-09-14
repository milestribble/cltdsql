const { Client } = require('pg')
const client = new Client({
  user: 'learner',
  host: 'localhost',
  database: 'cltdsql'
})
client.connect();

function add_task(title, due) {
  return new Promise( function (resolve,reject) {
    client.connect();
    if (!/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(due)) {
      reject('Invalid date')
    }
    client.query(`INSERT INTO tasks (title, status, due) VALUES ('${title}','waiting','${due}')`, (err, res) => {
      err ? reject(err.stack):undefined;
      client.end();
      resolve(res)
    })
  })
}

function add_tag(title) {
  return new Promise( function (resolve,reject) {
    client.query(`INSERT INTO tags (title) VALUES ('${title}') `, (err, res) => {
      err ? reject(err.stack):undefined;
      client.end();
      resolve(res)
    })
  })
}

function tag_task(task, tag) {
  return new Promise( function (resolve,reject) {
    client.query(`INSERT INTO tasktags (task_id, tag_id) VALUES ('${task}','${tag}') `, (err, res) => {
      err ? reject(err.stack):undefined;
      client.end();
      resolve(res)
    })
  })
}

function make_child(child, parent) {
  return new Promise( function (resolve,reject) {
    client.query(`INSERT INTO parent (parent_id, child_id) VALUES ('${parent}','${child}') `, (err, res) => {
      err ? reject(err.stack):undefined;
      client.end();
      resolve(res)
    })
  })
}

function show_table(table) {
  return new Promise( function (resolve,reject) {
    client.query(`SELECT * FROM ${table}`, (err, res) => {
      err ? reject(err.stack):undefined;
      client.end();
      resolve(res)
    })
  })
}
// new Promise( function (resolve,reject) {
//   client.query("SELECT concat(fname,' ',lname) as name FROM artists", (err, res) => {
//     err ? reject(err.stack):undefined;
//     client.end();
//     resolve(res.rows)
//   })
// }).then( data => {
//   data.forEach( function(el){ console.log(el.name) } )
// }).catch(error=>console.error(error))

// new Promise( function (resolve,reject) {
//   client.query("SELECT concat(artists.fname,' ',artists.lname) as name, albums.title FROM albums JOIN artists ON albums.artist=artists.id", (err, res) => {
//     err ? reject(err.stack):undefined;
//     client.end();
//     resolve(res.rows)
//   })
// }).then( data => {
//   console.log(data)
// }).catch(error=>console.error(error))

// new Promise( function (resolve,reject) {
//   client.query(`INSERT INTO albums (artist, title, year) VALUES ('${process.argv[2]}','${process.argv[3]}',${process.argv[4]}) `, (err, res) => {
//
//
//     err ? reject(err.stack):undefined;
//
//     client.end();
//     resolve(res)
//   })
// }).then( data => {
//   console.log(data) } )
// .catch(error=>console.error(error))

module.exports = {
  add_task,
  add_tag,
  tag_task,
  make_child,
  show_table
}
