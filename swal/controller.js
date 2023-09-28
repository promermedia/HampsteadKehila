import * as M from "./model.js";
import * as V from "./view.js";
const bg = document.querySelector("#swal-bg");

export class SWAL {
  constructor(
    _title,
    _text = null,
    _okBtn,
    _cancelBtn,
    _blockBG,
    _multi = false,
    _stopFade = false
  ) {
    this.OK = _okBtn ? true : false;
    this.cancel = _cancelBtn ? true : false;
    this.multi = _multi; // {part:0} // from SwalMulti
    this.cont = V.prepHTML(_title, _text, _okBtn, _cancelBtn, this.multi);
    this.blockBG = _blockBG;
    this.stopFade = _stopFade;
  }

  alert(callback = null) {
    this.createSWAL(this.cont)
      .catch((err) => {})
      .finally(() => {
        V.close(this.stopFade);
        if (callback) callback();
      });
  }

  alertFade(time) {
    this.createSWAL(this.cont).catch((err) => {});
    setTimeout(() => {
      V.close(this.stopFade);
    }, time);
  }

  form(array) {
    var isLast =
      this.multi && this.multi.last === true ? this.multi.last : false;
    let form = this.cont.querySelectorAll(".swal-content-cont");
    form = form[form.length - 1];
    V.createForm(form, array); // Adds all the inputs to the swal input container
    if (!this.multi || isLast === true) {
      if (this.multi && isLast === true) {
        this.giveMultiTriggers(form.parentElement, true);
      }
      return new Promise((resolve, reject) => {
        this.createSWAL(this.cont, this.fade)
          .then((res) => {
            var checkboxes = null;
            var inputs = this.cont.querySelectorAll(".for-form");
            var formData = {};
            inputs.forEach((x) => {
              if (x.type == "checkbox") {
                if (!checkboxes) checkboxes = {};
                if (!checkboxes[x.name]) checkboxes[x.name] = [];
                if (x.checked === true) checkboxes[x.name].push(x.value);
              } else if (x.type == "radio") {
                if (x.checked === true) formData[x.name] = x.value;
              } else if (x.value) {
                formData[x.name] = x.value;
              }
            });
            if(checkboxes)formData.checkboxes = checkboxes
            V.close(this.stopFade);
            resolve(formData);
          })
          .catch((e) => {
            reject(e);
            V.close(this.stopFade);
          });
      });
    } else {
      this.giveMultiTriggers(form.parentElement, false);
    }
  }

  prompt(placeholder, type) {
    return new Promise((resolve, reject) => {
      var form = this.cont.querySelector(".swal-content-cont");
      var arr = [{ type: type, placeholder: placeholder }];
      V.createForm(form, arr);
      this.createSWAL(this.cont)
        .then((res) => {
          if (res) {
            var input = form.querySelector("input");
            if (input.value) resolve(input.value);
            else reject("No value entered");
          } else {
            reject("Canceled SWAL");
          }
          V.close(this.stopFade);
        })
        .catch((err) => console.log(err));
    });
  }

  confirm(params) {
    // In case you want to pass data through the promise
    return new Promise((resolve, reject) => {
      this.createSWAL(this.cont)
        .then((res) => {
          if (res) resolve(params || true);
          else {
            reject("canceled confirm");
          }
          V.close(this.stopFade);
        })
        .catch((err) => reject("canceled confirm"));
    });
  }

  giveMultiTriggers(form, last) {
    var partPrev = this.multi.part - 1;
    var partNext = this.multi.part + 1;

    var prevBtn = form.querySelector(".swal-prev-btn");
    var cancelBtn = form.querySelector(".swal-cancel-btn");
    if (cancelBtn)
      cancelBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        V.close(this.stopFade);
      });

    if (prevBtn)
      prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggle(partPrev);
      });
    if (last) return;

    var nextBtn = form.querySelector(".swal-ok-btn");
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var missing = M.checkRequired(nextBtn.parentElement.parentElement);

      if (missing.length > 0) {
        missing.forEach((x) => {
          $(x).find(".swal-error-field").show();
        });
      } else {
        $(".swal-error-field").hide();
        toggle(partNext);
      }
    });

    function toggle(p) {
      var id = "multi-part-" + p;
      $(".swal-multi-cont").hide();
      let part = document.getElementById(id);
      $(part).show();
    }
  }

  createSWAL(container, stopFade) {
    const That = this;
    var isLast =
      That.multi && That.multi.last === true ? That.multi.last : false;
    return new Promise((resolve, reject) => {
      if (!That.multi || isLast === true) {
        $("#multi-part-0").show();
        if (!stopFade) $(bg).fadeIn(500);
        else $(bg).hide();
      }

      if (That.blockBG !== true) {
        $(bg).click(function () {
          reject("Closed SWAL");
          V.close(That.stopFade);
        });
      }

      That.cont.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      const error = () => {
        reject("Canceled SWAL");
        V.close(stopFade);
        document.removeEventListener("keydown", enterKey);
      };

      const success = (e) => {
        if (e) e.stopPropagation();
        var missing = M.checkRequired();
        if (missing.length > 0) {
          missing.forEach((x) => {
            $(x).find(".swal-error-field").show();
          });
        } else {
          resolve("submit");
          document.removeEventListener("keydown", enterKey);
        }
      };

      if (That.cancel) {
        let btn = container.querySelector(".swal-cancel-btn");
        btn.addEventListener("click", function (e) {
          error();
        });
      }
      if ((!That.multi && That.OK) || isLast === true) {
        let btns = container.parentElement.querySelectorAll(".swal-ok-btn");
        btns[btns.length - 1].addEventListener("click", function (e) {
          success(e);
        });
      }

      const enterKey = (e) => {
        if (e.which == 13) {
          success();
        } else if (e.which == 27) {
          error();
        }
      };

      if (!That.multi || isLast === true)
        document.addEventListener("keydown", enterKey);
    });
  }
}
