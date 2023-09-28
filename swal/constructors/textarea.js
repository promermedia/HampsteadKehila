export class SwalTextArea extends HTMLTextAreaElement {
  constructor(_placeholder, _name, _class, _required, _value, _id) {
    super();
    this.placeholder = _placeholder;
    this.className = "swal-input for-form materialize-textarea";
    if (_class) this.className += ` ${_class}`;
    if (_name) this.name = _name;
    if (_value) this.value = _value;
    if (_id) this.id = _id;

    if (_required) this.setAttribute("required", true);
  }
}
customElements.define("swal-text-area", SwalTextArea, { extends: "textarea" });
