import { SWAL } from "../controller.js";

export class SwalMulti {
  constructor(_title, _text, _okBtn, _cancelBtn, _blockBG, _multi) {
    this.multi = _multi;
    const stopFade = this.multi.stopFade ? true : false;
    this.swal = new SWAL(
      _title,
      _text,
      _okBtn,
      _cancelBtn,
      _blockBG,
      this.multi,
      stopFade
    );
  }
  form(array) {
    if (this.multi && this.multi.last == true) {
      // var id = "multi-part-" + this.multi.part;
      $(".swal-multi-cont").hide();
      $("#multi-part-0").show();
      return new Promise((resolve, reject) => {
        this.swal
          .form(array)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => reject(e));
      });
    } else {
      this.swal.form(array);
    }
  }
}
