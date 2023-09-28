export class ErrorAlert extends HTMLElement {
  constructor(_class, _text = "Ce champ est obligatoire") {
    super();
    this.innerText = _text;
    this.className = "error-field";
    if (_class) this.className += " " + _class;
    this.style.display = "none";
  }
}
customElements.define("error-alert", ErrorAlert);
