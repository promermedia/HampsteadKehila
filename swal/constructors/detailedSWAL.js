import { SWAL } from "../controller.js";

export default class DetailedSWAL extends SWAL {
  constructor(_title, _content) {
    // _content should be an instance of DTSWALcontent
    super(_title, null, null, "Close", false, false, false);
    this.detailContent = _content;
  }

  openContent() {
    var contentContainer = this.cont.querySelector(".swal-content-cont");
    contentContainer.append(this.detailContent);
    this.alert();
  }
}
