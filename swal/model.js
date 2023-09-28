const createSWAL = (html) => {
  return new Promise((resolve, reject) => {
    var bg = document.querySelector("#swal-bg");
    bg.innerHTML = html;
    bg.addEventListener("click", function () {
      meirSwal.close();
    });
    document
      .querySelector("#swal-cont")
      .addEventListener("click", function (e) {
        e.stopPropagation();
      });
    $("#swal-bg").fadeIn(500, function () {
      if (meirSwal.insertCancelBtn === true) {
        document
          .querySelector("#swal-cancel-btn")
          .addEventListener("click", function () {
            resolve(false);
          });
      }
      if (meirSwal.insertOkBtn === true) {
        document
          .querySelector("#swal-ok-btn")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });
  });
};

function checkRequired(cont = document.querySelector("#swal-cont")) {
  var missing = [];
  var allInputs = cont.querySelectorAll(".for-form-cont");
  allInputs.forEach((z) => {
    var x = z.querySelector(".for-form");
   if (x) var req = x.getAttribute("required");
    if (req && !x.value) {
      missing.push(z);
    }
  });
  return missing;
}

export { createSWAL, checkRequired };
