(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const {new_entry} = require('./templates.js')

document.getElementsByClassName('footer')[0].children[1].addEventListener('click',add)
document.getElementsByClassName('footer')[0].children[0].addEventListener('click',remove)

tasks = {
  add     : function (node) {
    this.next;
    this.object[this.next] = node;
    this.next++;
  },
  update  : function () {
    document.getElementById('stuff').innerHTML = '';
    for(x in this.object){
      document.getElementById('stuff').append(this.object[x])
    }
  },
  remove  : function () {
    for(x in this.object){
      if(this.object[x] instanceof HTMLDivElement){
        
      } else {

      }
    }
  },
  object   : {},
  next    : 0
};

function add(){
  tasks.add(new_entry())
  tasks.update()
}

function remove(){
  tasks.remove()
  tasks.update()
}

add()
add()
// create(tasks);
//
// let entrys = document.getElementsByClassName('list_entry')
// for(let i=0; i<entrys.length; i++){
//   entrys[i].addEventListener('focus', function (){
//     this.getElementsByClassName('task')[0].classList.add('bold')
//   },true);
//   entrys[i].addEventListener('blur', function (){
//     this.getElementsByClassName('task')[0].classList.remove('bold')
//   },true);
//   entrys[i].getElementsByClassName('toggle')[0].addEventListener('mousedown', function (){
//     this.classList.toggle('bold-toggle');
//     entrys[i].getElementsByClassName('task')[0].classList.toggle('bold-persistence')
//   },true);
// };

},{"./templates.js":2}],2:[function(require,module,exports){
module.exports = {new_entry}

function new_entry(array) {

    entry = document.getElementsByClassName('task')[0].cloneNode(true);
    entry.addEventListener('focus', function () {
      this.getElementsByClassName('task_entry')[0].classList.add('task_entry_bold')
    }, true);
    entry.addEventListener('blur', function (){
      this.getElementsByClassName('task_entry')[0].classList.remove('task_entry_bold');
    },true);
    entry.getElementsByClassName('task_toggle')[0].addEventListener('mousedown', function (){
      this.classList.toggle('task_toggle_bold');
      this.nextSibling.nextSibling.classList.toggle('task_entry_bold_persist');
    },true);

    return entry;

}

},{}]},{},[1]);
