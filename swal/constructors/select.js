export class SwalSelect extends HTMLSelectElement {
  constructor(
    _options = [{ text, val }],
    _placeholder,
    _name,
    _class,
    _required,
    _value,
  ) {
    super();
    this.className = "for-form";
    if (_class) this.className += ` real-${_class}`;
    if (_name) this.name = _name;
    if (_required) this.setAttribute("required", true);
    _options.unshift({ val: "", text: _placeholder });
    _options.forEach((x) => {
      var o = document.createElement("option");
      if (x.logo) {
        o.setAttribute("data-icon", `./assets/thumbs/${x.logo}.png`);
      }
      o.innerText = x.text;
      o.value = x.val;
      if (_value && _value == x.val) o.selected = true;
      this.append(o);
    });
  }
}
customElements.define("swal-select", SwalSelect, { extends: "select" });
