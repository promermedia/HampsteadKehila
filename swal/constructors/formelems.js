export class FormElems {
  constructor(
    _type,
    _placeholder,
    _name,
    _class,
    _options,
    _callback,
    _required,
    _id,
    _innerHTML,
    _value
  ) {
    this.type = _type;
    this.placeholder = _placeholder;
    this.name = _name;
    this.class = _class;
    this.options = _options;
    this.callback = _callback;
    this.required = _required;
    this.id = _id;
    this.innerHTML = _innerHTML;
    this.value = _value;
  }
}
