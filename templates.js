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
