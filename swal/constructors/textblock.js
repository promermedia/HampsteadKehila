export class SwalTextBlock extends HTMLElement {
  constructor(_ID, _class, _innerHTML) {
    super();
    if(_ID) this.id = _ID;
    this.className = "swal-text-block";
    if (_class) this.className += ` ${_class}`;
    this.innerHTML = _innerHTML
  }
}
customElements.define("swal-text-block", SwalTextBlock);