const { Client } = require('pg')

function query(statement){
  return new Promise(function(resolve,reject){
    client =  new Client({
      user: 'learner',
      host: 'localhost',
      database: 'cltdsql'
    })
    client.connect()
    client.query(statement,function(err,result){
      if (err) reject(err)
      resolve(result)
    })
  })
}

function add_task(req){
  return new Promise( function (resolve,reject) {
    let above = 0, inside = 0;
    console.log(1, req);
    if(req.db_id){
        query(`SELECT self, above, inside FROM tasks WHERE self = '${req.db_id}'`)
      .then((result)=>{
        console.log('above', result.rows[0].above);
        above = result.rows[0].above
        inside = result.rows[0].inside})
      .then(go).catch(err=>{throw new Error('queries.js>add_task>if(req): ' + err.message)})
    }else{go()}
    function  go (){
      query(`INSERT INTO tasks ( status, due ) VALUES ('waiting', '2000-01-01' ) RETURNING *`)
    .then((result)=>
      move(result.rows[0].self,above,inside))
    .then((db_id)=>
      query(`SELECT self, above, inside, status, due FROM tasks WHERE self = '${db_id}'`))
    .then((result)=>
      resolve(result.rows[0]))
    .catch(err=>{throw new Error('queries.js>add_task>go(): ',err.message)})
    }
  })
}

function move(db_id,above,inside) {
  return new Promise(function(resolve,reject){
    query(`SELECT self, above, inside FROM tasks WHERE inside = '${inside}' AND above = '${above}'`)
    .then((result)=>{
      if(result.rowCount){
           query(`UPDATE tasks SET above = '${db_id}', inside = '${inside}' WHERE tasks.self = ${result.rows[0].self};
                   UPDATE tasks SET above = '${above}', inside = '${inside}' WHERE tasks.self = ${db_id};`)
          .then(()=>resolve(db_id))
          .catch(err=>{throw new Error('queries.js>move>if(result.rowCount): ',err.message)})
          }
      else{query(`UPDATE tasks SET above = '${above}', inside = '${inside}' WHERE tasks.self = ${db_id};`)
        .then(()=>resolve(db_id))
        .catch(err=>{throw new Error('queries.js>move>else(result.rowCount: ',err.message)})
      }
    })
  })
}

function change(task) {
  return new Promise( function (resolve,reject) {
    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(task.due)){
        query(`UPDATE tasks SET entry = '${task.entry}', status = '${task.status}', due = '${task.due}' WHERE tasks.self = ${task.id} RETURNING *`)
      .then((result)=>resolve(result.rows[0]))
    }else{console.log('bad date');}
  })
}

function refresh(task) {
  return new Promise( function (resolve,reject) {
      query(`SELECT inside FROM tasks GROUP BY inside`)
    .then((result)=>result.rows.map(function(parent){
      return new Promise(function(resolve,reject){
          query(`SELECT self, above, inside FROM tasks WHERE inside = ${parent.inside}`)
        .then((result)=>resolve(result.rows))
      })
    }))
    .then((promises)=>Promise.all(promises))
    .then((results)=>{//move arrays into object associating arrays with their own above prop
      let object = {}
      results.forEach( function(el){
        object[el[0].inside]=el
      })                              //object is now holding {0:[array],1:[array]}
      for(inside in object){        //For Every inside, inside being an array of task objects in the same parent
        object[inside] = object[inside].reduce(function(acuobj,el){
          acuobj[el['above']] = el
          return acuobj
        },{})
      }
      for(inside in object){        //For Every inside, inside being an array of task objects in the same parent
        let array = []
        bo (0)
        function bo (above){
          above = above.toString()
          array.push(object[inside][above])
          if (object[inside][object[inside][above].self]){bo(object[inside][above].self)}
          return
        }
        object[inside] = array;
      }
      return object
  // { '0':
  //  [ anonymous { self: 47, above: 0, inside: 0 },
  //    anonymous { self: 46, above: 47, inside: 0 },
  //    anonymous { self: 44, above: 46, inside: 0 },
  //    anonymous { self: 45, above: 44, inside: 0 },
  //    anonymous { self: 43, above: 45, inside: 0 },
  //    anonymous { self: 42, above: 43, inside: 0 },
  //    anonymous { self: 41, above: 42, inside: 0 },
  //    anonymous { self: 40, above: 41, inside: 0 },
  //    anonymous { self: 39, above: 40, inside: 0 },
  //    anonymous { self: 38, above: 39, inside: 0 },
  //    anonymous { self: 37, above: 38, inside: 0 },
  //    anonymous { self: 36, above: 37, inside: 0 },
  //    anonymous { self: 35, above: 36, inside: 0 },
  //    anonymous { self: 34, above: 35, inside: 0 },
  //    anonymous { self: 33, above: 34, inside: 0 },
  //    anonymous { self: 32, above: 33, inside: 0 },
  //    anonymous { self: 31, above: 32, inside: 0 },
  //    anonymous { self: 30, above: 31, inside: 0 },
  //    anonymous { self: 29, above: 30, inside: 0 },
  //    anonymous { self: 28, above: 29, inside: 0 },
  //    anonymous { self: 27, above: 28, inside: 0 },
  //    anonymous { self: 26, above: 27, inside: 0 },
  //    anonymous { self: 25, above: 26, inside: 0 },
  //    anonymous { self: 24, above: 25, inside: 0 },
  //    anonymous { self: 23, above: 24, inside: 0 },
  //    anonymous { self: 20, above: 23, inside: 0 },
  //    anonymous { self: 19, above: 20, inside: 0 },
  //    anonymous { self: 18, above: 19, inside: 0 },
  //    anonymous { self: 16, above: 18, inside: 0 },
  //    anonymous { self: 15, above: 16, inside: 0 },
  //    anonymous { self: 14, above: 15, inside: 0 },
  //    anonymous { self: 13, above: 14, inside: 0 },
  //    anonymous { self: 12, above: 13, inside: 0 },
  //    anonymous { self: 10, above: 12, inside: 0 },
  //    anonymous { self: 11, above: 10, inside: 0 },
  //    anonymous { self: 9, above: 11, inside: 0 },
  //    anonymous { self: 7, above: 9, inside: 0 },
  //    anonymous { self: 6, above: 7, inside: 0 },
  //    anonymous { self: 8, above: 6, inside: 0 },
  //    anonymous { self: 5, above: 8, inside: 0 } ],
  // '1':
  //  [ anonymous { self: 17, above: 0, inside: 1 },
  //    anonymous { self: 21, above: 17, inside: 1 },
  //    anonymous { self: 22, above: 21, inside: 1 } ] }
    })
    .then((result)=>{
      let array = []
      result[0]
      //start with result[0] <- order list of 0's children
      //and pop() each task
      //push task into array
      //if task object has prop of task.self
      //  recall this function for that array
      //then continue moving down this list
    })
    // .catch((err)=>console.log('yelp, ',err))
  })
}







// function load(task) {
//   return new Promise( function (resolve,reject) {
//     let client = newClient()
//     client.connect();
//     if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(task.due)) {
//       client.end();
//       reject('Invalid date')
//     }
//     client.query(`SELECT id FROM tasks`,function(err, result) {
//       if(err) reject('db Load error')//handle error
//       else {
//         resolve(result.rows);
//       }
//     });
//   })
// }

//
// //{'task_id':80,'sib_id':81} where 80 has nothing//
// //{'task_id':80,'sib_id':91} where 80 has 81
// //
// //does 80 have any current sibs  .//has 80,81
// //  if so, modify record 91,81
// //create new 80 , {81,91} record
// //
// //
//
// function add_sibling(req) {
//   return new Promise( function (resolve,reject) {
//     let intotasks = newClient()
//     intotasks.connect();
//     console.log('req.task_id: ',req.task_id);
//     console.log('req.sib_id: ',req.sib_id);
//     let query = `SELECT * FROM siblings WHERE task_id = ${req.task_id}`;
//     intotasks.query(query,function(err, result) {
//       let queries = []
//       if(result.rows[0]){ //handle error
//         queries.push(`UPDATE siblings SET task_id = '${req.sib_id}' WHERE siblings.sib_id=${result.rows[0].sib_id}`)
//       }
//         queries.push(`INSERT INTO siblings (task_id,sib_id) VALUES ('${req.task_id}','${req.sib_id}')`)
//
//       queries.reduce(function(cur, next) {
//           return cur.then(()=>new Promise(function(resolve,reject){
//             let intotasks = newClient()
//             intotasks.connect();
//             intotasks.query(next,function(err,result){
//               if (err) reject('error on query: ',next)
//               resolve()
//             })
//           }));
//       }, Promise.resolve()).then(function() {
//           resolve()
//       });
//     });
//   })
// }
//

//
// function remove_task(task) {
//   return new Promise( function (resolve,reject) {
//     let client = newClient();
//     client.connect();
//     console.log(3);
//     client.query(`SELECT * FROM siblings WHERE siblings.task_id=${task.id} OR siblings.sib_id=${task.id}`,
//
//     function(err, result) {
//       if(err) reject('Update error')
//       let sibEntrys = []
//       for(x in result.rows){sibEntrys.push(result.rows[x])}
//       console.log(22);
//       if (sibEntrys.length==2){
//         console.log(sibEntrys[0].task_id,task.id);
//         console.log(sibEntrys[1].task_id,task.id);
//         let sib_id, task_id;
//         if (sibEntrys[0].task_id==task.id){
//           console.log(sibEntrys[1]);
//           sib_id = sibEntrys[0].sib_id
//           task_id = sibEntrys[1].task_id
//         }else if (sibEntrys[1].task_id==task.id){
//           console.log(sibEntrys[1]);
//           sib_id = sibEntrys[1].sib_id
//           task_id = sibEntrys[0].task_id
//         }
//           let query1 = `DELETE FROM siblings WHERE task_id=${task.id}`
//           let query2 = `UPDATE siblings SET sib_id = '${sib_id}' WHERE task_id=${task_id}`
//           let query3 = `DELETE FROM task WHERE id=${task.id}`
//         let promises = [
//           new Promise((resolve,reject)=>{client.query(query1, function(err, results){
//             if (err) {console.log('query1 failed')} resolve(result.command)})}),
//           new Promise((resolve,reject)=>{client.query(query2, function (err, results){
//             if (err) {console.log('query2 failed')} resolve(result.command)})}),
//           new Promise((resolve,reject)=>{client.query(query3, function (err, results){
//           if (err) {console.log('query3 failed')} resolve(result.command)})})
//         ]
//         Promise.all(promises).then((result)=>resolve(result))
//       }
//     });
//   })
// }
//
//
// /* client.query(`DELETE FROM task WHERE task.id=${task.id}`*/
//
// function add_tag(title) {
//   return new Promise( function (resolve,reject) {
//     client.query(`INSERT INTO tags (title) VALUES ('${title}') `, (err, res) => {
//       err ? reject(err.stack):undefined;
//       client.end();
//       resolve(res)
//     })
//   })
// }
//
// function tag_task(task, tag) {
//   return new Promise( function (resolve,reject) {
//     client.query(`INSERT INTO tasktags (task_id, tag_id) VALUES ('${task}','${tag}') `, (err, res) => {
//       err ? reject(err.stack):undefined;
//       client.end();
//       resolve(res)
//     })
//   })
// }
//
// function make_child(child, parent) {
//   return new Promise( function (resolve,reject) {
//     client.query(`INSERT INTO parent (parent_id, child_id) VALUES ('${parent}','${child}') `, (err, res) => {
//       err ? reject(err.stack):undefined;
//       client.end();
//       resolve(res)
//     })
//   })
// }
//
// function show_table(table) {
//   return new Promise( function (resolve,reject) {
//     client.query(`SELECT * FROM ${table}`, (err, res) => {
//       err ? reject(err.stack):undefined;
//       client.end();
//       resolve(res)
//     })
//   })
// }
// // new Promise( function (resolve,reject) {
// //   client.query("SELECT concat(fname,' ',lname) as name FROM artists", (err, res) => {
// //     err ? reject(err.stack):undefined;
// //     client.end();
// //     resolve(res.rows)
// //   })
// // }).then( data => {
// //   data.forEach( function(el){ console.log(el.name) } )
// // }).catch(error=>console.error(error))
//
// // new Promise( function (resolve,reject) {
// //   client.query("SELECT concat(artists.fname,' ',artists.lname) as name, albums.title FROM albums JOIN artists ON albums.artist=artists.id", (err, res) => {
// //     err ? reject(err.stack):undefined;
// //     client.end();
// //     resolve(res.rows)
// //   })
// // }).then( data => {
// //   console.log(data)
// // }).catch(error=>console.error(error))
//
// // new Promise( function (resolve,reject) {
// //   client.query(`INSERT INTO albums (artist, title, year) VALUES ('${process.argv[2]}','${process.argv[3]}',${process.argv[4]}) `, (err, res) => {
// //
// //
// //     err ? reject(err.stack):undefined;
// //
// //     client.end();
// //     resolve(res)
// //   })
// // }).then( data => {
// //   console.log(data) } )
// // .catch(error=>console.error(error))
//
module.exports = {
  add_task,
  change,
  refresh
  // add_sibling,
  // change_task,
  // remove_task,
  // add_tag,
  // tag_task,
  // make_child,
  // show_table
}
