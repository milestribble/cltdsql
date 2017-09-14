module.exports = {new_entry}

function new_entry() {

    let entry = document.getElementsByClassName('task')[0].cloneNode(true);
    entry.getElementsByClassName('task_entry')[0].addEventListener('bounce', function () {

      this.classList.add('task_entry_bold')
      let el = this;

      let range = document.createRange();
      let sel = window.getSelection();
      range.setStart(entry.nextSibling.getElementsByClassName('task_entry')[0], 0);
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
