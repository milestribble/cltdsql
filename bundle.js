(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const {new_entry} = require('./templates.js')
const popout = new Event('popout')

let exampleSocket = new WebSocket("ws://localhost:6050")
setTimeout(function(){exampleSocket.send("Here's some text that the server is urgently awaiting!");}, 2000)
exampleSocket.onmessage = function (event) {
  console.log(event.data);
}

document.getElementsByClassName('footer')[0].children[1].addEventListener('click',add);
document.getElementsByClassName('footer')[0].children[0].addEventListener('click',remove);
document.addEventListener('pop_blur', function (e) {
  save(e.detail);
}, false);
document.addEventListener('newline', function (e) {

  add(e.detail);
  e.detail.getElementsByClassName('task_entry')[0].children[0].remove()
  e.detail.getElementsByClassName('task_entry')[0].classList.remove('task_entry_bold');
}, false);

tasks = {
  add     : function (newNode,event) {
  if(!(event instanceof MouseEvent)){
    console.log('you hit return');
    this.array.splice(this.array.indexOf(event)+1,0,newNode)
    return newNode
  } else if(event instanceof MouseEvent) {
    this.array.push(newNode)-1;
    return newNode
    }
  },
  update  : function (event) {
    document.getElementById('stuff').innerHTML = '';
    this.array.forEach((el,index)=>{
      document.getElementById('stuff').appendChild(el).focus()

    })
    if(event){
      console.log(event);
      event.getElementsByClassName('task_entry')[0].dispatchEvent(new Event('bounce'))

    }

  },
  remove  : function () {
    this.array = this.array.filter((el)=>{
      if(el instanceof HTMLDivElement){
          if(el.getElementsByClassName('task_toggle')[0].classList.contains('task_toggle_bold')){
            return false
          }return true
      } else {
        this(el)
        return true
      }
    })
  },
  array   : []
};

function add(event){
  // if(tasks.object)
  if (!(event instanceof MouseEvent)){

    // event = event.nextSibling
  }
  console.log(event);
  tasks.update(tasks.add(new_entry(), event))
}

function remove(){
  tasks.remove()
  tasks.update()
}

function save(node){
  // console.log(node.getElementsByClassName('task_entry')[0].innerText);
}
add()

},{"./templates.js":2}],2:[function(require,module,exports){
module.exports = {new_entry}

function new_entry() {

    let entry = document.getElementsByClassName('task')[0].cloneNode(true);
    entry.getElementsByClassName('task_entry')[0].addEventListener('bounce', function () {

      this.classList.add('task_entry_bold')
      let el = this;

      let range = document.createRange();
      let sel = window.getSelection();
      range.setStart(entry.getElementsByClassName('task_entry')[0], 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    })
    entry.addEventListener('focus', function (e) {
      let entries = this.getElementsByClassName('task_entry')
      for(var i = 0; i < entries.length; i++) {
        entries[i].classList.remove('task_entry_bold')
      }
      this.getElementsByClassName('task_entry')[0].classList.add('task_entry_bold')
    }, true);
    entry.addEventListener('blur', function (){
      let pop_blur = new CustomEvent('pop_blur', {detail: entry })
      this.getElementsByClassName('task_entry')[0].classList.remove('task_entry_bold');
      document.dispatchEvent(pop_blur);
    },true);
    entry.addEventListener('keyup', function (e){
      if(e.key=='Enter'){
        let newline = new CustomEvent('newline', {detail: entry })
        document.dispatchEvent(newline);
      }
    },true);
    entry.getElementsByClassName('task_toggle')[0].addEventListener('mousedown', function (){
      this.classList.toggle('task_toggle_bold');
      this.nextSibling.nextSibling.classList.toggle('task_entry_bold_persist');
    },true);

    return entry;

}

},{}]},{},[1]);
