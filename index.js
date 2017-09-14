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
