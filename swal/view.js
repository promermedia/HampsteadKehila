import { SwalCheckbox } from "./constructors/checkbox.js";
import { ErrorAlert } from "./constructors/errorAlert.js";
import { SwalInput } from "./constructors/input.js";
import { SwalRadio } from "./constructors/radio.js";
import { SwalSelect } from "./constructors/select.js";
import { SwalTextArea } from "./constructors/textarea.js";
import { SwalTextBlock } from "./constructors/textblock.js";

import "./style.css";

const bg = document.querySelector("#swal-bg");

const prepHTML = (title, text, okBtn, cancelBtn, multi) => {
  // {part: 0}
  var multiPartID = "multi-part-0";

  var BGAppend = false;

  if (!multi || multi.part === 0) {
    var cont = document.createElement("div");
    cont.id = "swal-cont";
    BGAppend = true;
  } else {
    BGAppend = false;
    var cont = document.getElementById("swal-cont");
    multiPartID = "multi-part-" + multi.part;
  }
  const multiDiv = document.createElement("div");
  multiDiv.className = "swal-multi-cont";
  multiDiv.id = multiPartID;
  cont.append(multiDiv);

  const h3 = document.createElement("h3");
  h3.className = "swal-title";
  h3.innerText = title;

  var p = null;
  if (text) {
    p = document.createElement("p");
    p.className = "swal-text";
    p.innerHTML = text;
  }

  const divInput = document.createElement("div");
  divInput.className = "swal-content-cont";

  const btnCont = document.createElement("div");
  btnCont.className = "swal-btn-cont";

  multiDiv.append(h3);
  if (p) multiDiv.append(p);
  multiDiv.append(divInput, btnCont);

  if (multi && multi.part != 0) {
    const prev = document.createElement("button");
    prev.className = "swal-btns swal-prev-btn";
    prev.innerText = "Back";
    btnCont.append(prev);
  }

  if (cancelBtn) {
    const cancel = document.createElement("button");
    cancel.className = "swal-btns swal-cancel-btn";
    cancel.innerText = cancelBtn;
    btnCont.append(cancel);
  }

  if (okBtn) {
    const okay = document.createElement("button");
    okay.className = "swal-btns swal-ok-btn";
    okay.innerText = okBtn;
    btnCont.append(okay);
  }

  if (!multi || (multi.part && multi.last === true)) {
    btnCont.parentElement.append(
      new ErrorAlert(
        "swal-error-field final-error-field",
        "You are missing some required fields"
      )
    );
  }

  if (BGAppend) bg.append(cont);

  return cont;
};

const close = (stopFade) => {
  var old = bg.querySelector("#swal-cont");
  if (old) old.remove();
  if (stopFade != true) $(bg).fadeOut(500);
  else $(bg).hide();
  $(bg).off();
};

const createForm = (form, arr) => {
  arr.forEach((x) => {
    const ThisID = x.id || "inputID_" + parseInt(Math.random() * 8999 + 1000);
    var input = null;
    var isDate = false;
    var isTime = false;
    var isSelect = false;
    switch (x.type) {
      case "select":
        input = new SwalSelect(
          x.options,
          x.placeholder,
          x.name,
          x.class,
          x.required,
          x.value
        );
        isSelect = x.class || true;

        break;
      case "date":
        input = new SwalInput(
          "text",
          x.placeholder,
          x.name,
          x.class + " datepicker",
          x.required,
          x.value,
          ThisID
        ).input;
        isDate = true;

        break;
      case "time":
        input = new SwalInput(
          "text",
          x.placeholder,
          x.name,
          x.class + " timepicker",
          x.required,
          x.value,
          ThisID
        ).input;
        isTime = true;

        break;
      case "radio":
        input = new SwalRadio(x.options, x.name, x.class, x.required);

        break;
      case "checkbox":
        input = new SwalCheckbox(x.options, x.name, x.class, x.required);

        break;
      case "textarea":
        input = new SwalTextArea(
          x.placeholder,
          x.name,
          x.class,
          x.required,
          x.value,
          ThisID
        );
        break;
      case "textblock":
        input = new SwalTextBlock(x.id, x.class, x.innerHTML);
        break;
      default:
        input = new SwalInput(
          x.type,
          x.placeholder,
          x.name,
          x.class,
          x.required,
          x.value,
          ThisID
        ).input;
    }
    var div = document.createElement("div");
    div.className = "for-form-cont";
    div.append(input);
    if (["text", "number", "textarea", "password"].includes(x.type)) {
      input.placeholder = "";
      div.classList.add("input-field");
      const label = document.createElement("label");
      if (x.value) label.className = "active";
      label.htmlFor = ThisID;
      label.innerHTML = x.placeholder;
      div.append(label);
    }
      if (x.required) {
        div.append(new ErrorAlert("swal-error-field"));
      }
    form.append(div);
    if (isDate)
      $(input).datepicker({
        autoClose: true,
        defaultDate: new Date(),
        setDefaultDate: true,
      });
    if (isTime)
      $(input).timepicker({
        autoClose: true,
        twelveHour: false,
      });
    if (isSelect) {
      M.FormSelect.init(input);
      if (x.class.includes("hide-first")) {
        $(input).parent().hide();
      }
    }
    if (x.callback) input.addEventListener(x.callback.event, x.callback.func);
  });
};

export { prepHTML, close, createForm };
