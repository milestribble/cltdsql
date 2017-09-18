const {new_entry} = require('./templates.js')
const header_boiler = {
  headers: {
   'Accept': 'application/json',
   'Content-Type': 'application/json'
 },
 method: "POST"
}

let top_id, base_id;

//this: randomizes the background color on launch
(function(){
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

function update (newNode) {
    if (!(top_id)){top_id = newNode.id }
    let header = header_boiler
    fetch(`http://localhost:6050/refresh`,header)
    .then(res => res.json())
    .then(db => {})
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
