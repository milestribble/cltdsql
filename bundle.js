(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const {new_entry, load_in} = require('./templates.js')
const header_boiler = {
  headers: {
   'Accept': 'application/json',
   'Content-Type': 'application/json'
 },
 method: "POST"
}

let win
//this: randomizes the background color on launch


(function(){
  load_in().then(()=>update())
  let r = Math.floor(Math.random()*200)
  let g = Math.floor(Math.random()*200)
  let b = Math.floor(Math.random()*200)
  document.body.style.backgroundColor = `rgba(${r},${g},${b},0.7)`
}())

//this: attaches click listeners to plus [add] and minus [remove] divs

document.getElementsByClassName('footer')[0].children[1].addEventListener('click',add_task);
document.getElementsByClassName('footer')[0].children[0].addEventListener('click',remove);

//this: attaches pop_blur listener to the document
//this: dispatched by event handler of a just-blurred task
//handler: passes task reference from event detail to save() method

document.addEventListener('pop_blur', function (e) {
  change(e.detail)
}, false);

//this: attaches newline listener to the document
//this: dispatched by event handler of a task in which the user hit 'return' [keyup]
//handler: removes extra div created in task due to hitting 'return'
//handler: removes underlines from task if non-toggled
//handler: triggers the creation of a new task and passes ref to triggering task

document.addEventListener('newline', function (e) {
  add_task(e.detail);
  e.detail.getElementsByClassName('task_entry')[0].classList.remove('task_entry_bold');
}, false);

function update () {
    let header = header_boiler
    fetch(`http://localhost:6050/refresh`,header)
    .then(res => res.json())
    .then(db => {
      let order = 1
      db.forEach(function(el){
          document.getElementById(el.id).style.order = order
          order++
      })
    })
    .catch(err=>console.log(err))
}

//this: envokes new_entry() from db and updates view

function add_task(crntTsk){

    new_entry(crntTsk instanceof MouseEvent ? undefined : crntTsk)
    .then ((newNode)=>{
      document.getElementById('task_box').append(newNode)
      update(newNode);
      newNode.getElementsByClassName('task_entry')[0].dispatchEvent(new Event('bounce'))
    })
}


//this: envokes task.remove
//this: envokes task.update

function remove(){
  toggled = document.getElementsByClassName('task_toggle_bold')
  toggled = (function(){
    let array = []
    for (let i=0; i<toggled.length; i++){
      array.push(toggled[i].parentElement)
    }
    return array
  }())
  toggled.reduce((cum,node)=>{
    return cum.then(()=>new Promise( function (resolution, rejection){
      let header = header_boiler
      header.body = JSON.stringify({'id':node.db_id,'next':node.db_next,'child':node.db_child})
      fetch(`http://localhost:6050/remove_task`,header)
      .then(res => res.json())
      .then(res => resolution(res))
    }))
  },Promise.resolve()).then(()=>{console.log('yo');toggled.forEach((el)=>el.remove())});
}

//this: notifies app.js about a tasks' creation, modification, or removal

function change(node){
  let header = header_boiler
  let innerText = node.getElementsByClassName('task_entry')[0].innerText.trimRight()
  header.body = JSON.stringify({'id':node.id,'entry':innerText,'status':node.db_status,'due':node.db_due })
  fetch(`http://localhost:6050/change`,header)
  .then(res => res.json())
  .then(res => console.log('change', res))
}

},{"./templates.js":2}],2:[function(require,module,exports){
//this: creates a new 'task' Node
//returns: new 'task' with eventListeners in place
module.exports = {load_in, new_entry}

const header_boiler = {
  headers: {
   'Accept': 'application/json',
   'Content-Type': 'application/json'
 },
 method: "POST"
}

function new_entry (crntTsk) {
  return new Promise(function (resolve, reject){

    //this: fetches a new task entry the db
    //this: sets the new task's 'savestatus' property as 'unsaved'
    let header = header_boiler
    crntTsk ? console.log(crntTsk.id):undefined;
    crntTsk ? header.body = JSON.stringify({db_id:crntTsk.id}): undefined
    fetch(`http://localhost:6050/add`,header)
    .then(res => res.json())
    .then(new_entry => resolve(make_task(new_entry)))
    .catch(function(res){ console.log(res) });
  })
}

function load_in (){
  return new Promise(function(resolve, reject){
    fetch(`http://localhost:6050/load`,header_boiler)
    .then(res => res.json())
    .then(res => {
      res.forEach((entry)=>{
        document.getElementById('task_box').append(make_task(entry))
      })
      resolve()
    })
    .catch(err=>reject(err))
  })
}

function make_task(prompt){
      //this: clones entry template into a new 'task' Node
      //this: sets the new task's db stati

      let entry = document.getElementsByClassName('task')[0].cloneNode(true);
      entry.id=prompt.self
      entry.db_due=prompt.due
      entry.db_status=prompt.status
      entry.getElementsByClassName('task_entry')[0].innerText=prompt.entry

      //this: attaches bounce listener to new task
      //this: dispatched by task.update()
      //handler: underlines and moves cursor into task node

      entry.getElementsByClassName('task_entry')[0].addEventListener('bounce', function () {
        this.classList.add('task_entry_bold')
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(entry.getElementsByClassName('task_entry')[0], 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      })

      //this: attaches focus listener to new task
      //handler: removes underlines from non-toggled tasks
      //handler: underlines this task when it recieves focus

      entry.addEventListener('focus', function (e) {
        let entries = this.getElementsByClassName('task_entry')
        for(var i = 0; i < entries.length; i++) {
          entries[i].classList.remove('task_entry_bold')
        }
        this.getElementsByClassName('task_entry')[0].classList.add('task_entry_bold')
      }, true);

      //this: attaches blur listener to new task
      //handler: removes underlines from task if non-toggled
      //handler: dispatches pop_blur with task ref to save()

      entry.addEventListener('blur', function (){
        this.getElementsByClassName('task_entry')[0].classList.remove('task_entry_bold');
        document.dispatchEvent(new CustomEvent('pop_blur', {detail: entry }));
      },true);

      //this: attaches keyup listener to new task
      //handler: removes underlines from task if non-toggled
      //handler: dispatches pop_blur to get text from task

      entry.addEventListener('keyup', function (e){
        if(e.key=='Enter'){
          let extra_div = this.getElementsByClassName('task_entry')[0].children[0]
          if (extra_div) extra_div.remove()
          let newline = new CustomEvent('newline', {detail: entry })
          document.dispatchEvent(newline);
        }
      },true);

      entry.getElementsByClassName('task_toggle')[0].addEventListener('mousedown', function (){
        entry.classList.toggle('selected')
        this.classList.toggle('task_toggle_bold');
        this.nextSibling.nextSibling.classList.toggle('task_entry_bold_persist');
      },true);

      //this: returns the new task Node

      return entry
}

},{}]},{},[1]);
