export class SwalRadio extends HTMLElement {
  constructor(_options, _name, _class, _required) {
    super();
    // this.className = "swal-input";
    this.style.display = "inline-block";
    if (_class) this.className += ` ${_class}`;
   if (_required) this.setAttribute("required", true);
    _options.forEach((x) => {
      var id = "swal-radio-" + x.val;
      var input = document.createElement("input");
      input.type = "radio";
      input.name = _name;
      input.id = id;
      input.className = "for-form";
      input.value = x.val;
      if (x.checked) input.checked = true;
      var label = document.createElement("label");
      var span = document.createElement("span");
      label.htmlFor = id;
      label.style.marginRight = "15px";
      // label.style.marginLeft = "5px";
      span.innerText = x.text;
      label.append(input, span);
      this.append(label);
    });
  }
}
customElements.define("swal-radio", SwalRadio);
