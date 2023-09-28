export class SwalInput {
  constructor(_type, _placeholder, _name, _class, _required, _value, _id) {
    this.input = document.createElement("input");
    if (!_type) _type = "text";
    this.input.type = _type;
    this.input.placeholder = _placeholder;
    this.input.className = "swal-input for-form";
    if (_class) this.input.className += ` ${_class}`;
    if (_name) this.input.name = _name;
    if (_value) this.input.value = _value;
    if (_id) this.input.id = _id;

    if (_required) this.input.setAttribute("required", true);
  }
}
// customElements.define("swal-input", SwalInput, { extends: "input" });
