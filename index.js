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
