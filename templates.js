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
