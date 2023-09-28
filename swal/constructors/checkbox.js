
export class SwalCheckbox extends HTMLElement {
  constructor(_options, _name, _class, _required) {
    super();
    this.style.display = "inline-block";
    if (_class) this.className += ` ${_class}`;
    if (_required) this.setAttribute("required", true);
    _options.forEach((x) => {
      var id = "swal-checkbox-" + _name + "-" + x.val;
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = _name;
      input.id = id;
      input.className = "for-form";
      input.value = x.val;
      if (x.checked) input.checked = true;
      var label = document.createElement("label");
      var span = document.createElement("span");
      label.htmlFor = id;
      label.style.marginRight = "15px";
      span.innerText = x.text;
      label.append(input, span);
      this.append(label);
    });
  }
}
customElements.define("swal-checkbox", SwalCheckbox);
