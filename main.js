import { SWAL } from "./swal/controller.js";
import { FormElems } from "./swal/constructors/formelems.js";
import modifySeat from "./admin/modify/model.js";
import modifyView from "./admin/modify/view.js";
import adminAddsReservation from "./admin/reserve/model.js";
import {
  DOM,
  createReserveForm,
  updateDisplay,
  reservationForm,
} from "./app/view.js";
import { Tools } from "./app/model.js";
import { createReservationTable } from "./admin/view.js";
import Seat from "./constructors/seat.js";

var adminMode = false;
var adminPassword = "";
var adminOpened = false;
const originalText = "Vous n'avez pas encore sélectionné de sièges.";

const AllSeats = {
  takenSeats: [],
  availableSeats: [],
  reservedSeats: [],
  availableObjects: [],
};

const Prices = { rebate: 126, men: 180, woman: 152, selected: 180 };
const TempName = { fName: "", lName: "" };

$(DOM.reserve).click(reserveNow);
$(DOM.adminLock).click(adminPortal);
fetch("https://www.sivantours.com/api/yamimNoraim/getReservations")
  .then((res) => res.json())
  .then((data) => {
    if (data && data.Table && data.Table.length > 0) {
      AllSeats.takenSeats = Tools.tableReducer(data.Table);
      blockSeats(AllSeats.takenSeats);
    }
    Tools.updateAvailableSeats(AllSeats, holdSeat);
  });

function blockSeats(ARR, bigX, smallName) {
  $(".seat").off();
  $(".seat").html("");
  $(".seat").removeClass("taken");
  ARR.forEach((x) => {
    if (x.seats.length > 0) {
      const T = x.table;
      const S = x.seats;
      const Tables = document.querySelectorAll(`div[table='${T}']`);
      S.forEach((s) => {
        for (let Table of Tables) {
          const seat = Table.querySelector(`div[seat='${s.seat}']`);
          if (seat) {
            seat.classList.add("taken");

            if (smallName) {
              if(s.paid != 1) seat.classList.add("unpaid");
              addSmallName(seat, s.f_name + " " + s.l_name);
              $(seat).click(function () {
                modifySeat(
                  s,
                  seat,
                  modifyView.form(AllSeats, s),
                  adminPassword,
                  getAdminInfo
                );
              });
            } else {
              if (bigX) seat.innerHTML = bigX;
            }
            break;
          } else {
          }
        }
      });
    }
  });
}

function addSmallName(div, name) {
  div.innerHTML = `<div class='small-names'>${name}</div>`;
  $(div).off("click", holdSeat);
  div.classList.add("taken");
  Tools.updateAvailableSeats(AllSeats, holdSeat);
}

function holdSeat() {
  const F = createReserveForm(TempName, Prices);
  const That = this;
  const table = That.parentElement.getAttribute("table");
  const seatNum = That.getAttribute("seat");
  Prices.selected = "LMNOP".includes(table) ? Prices.woman : Prices.men;
  if (That.taken == false) {
    new SWAL(
      `Reserver ${table + seatNum}`,
      `Prix pour ce siège: $<span id="price-in-swal">${Prices.selected}</span> `,
      "OK",
      "Annuler"
    )
      .form(F)
      .then((result) => {
        if (result.checkboxes.rebate.length > 0)
          Prices.selected = Prices.rebate;
        TempName.fName = result.fName;
        TempName.lName = result.lName;

        const seat = new Seat(
          result.fName,
          result.lName,
          Prices.selected,
          table,
          parseInt(seatNum),
          That
        );
        if (adminMode === true) {
          adminAddsReservation(seat, adminPassword, addSmallName);
        } else {
          AllSeats.reservedSeats.push(seat);

          That.taken = true;
          That.innerHTML = `<i class="fa-solid fa-check"></i>`;
          updateDisplay(AllSeats);
        }
      })
      .catch((err) => {});
  } else {
    for (let i = 0; i < AllSeats.reservedSeats.length; i++) {
      const x = AllSeats.reservedSeats[i];
      if (x.table == table && x.seat == seatNum) {
        new SWAL(
          "Supprimer un siège",
          `Êtes-vous sûr de vouloir supprimer le siège de<br>${
            x.fName + " " + x.lName
          } ?`,
          "Oui",
          "Non"
        )
          .confirm()
          .then((res) => {
            AllSeats.reservedSeats.splice(i, 1);
            That.taken = false;
            That.innerHTML = "";
            updateDisplay(AllSeats);
          })
          .catch((err) => {});
        break;
      }
    }
  }
}

function reserveNow() {
  if (AllSeats.reservedSeats.length > 0) {
    $(DOM.reserve).off("click", reserveNow);
    const arr = reservationForm(AllSeats);
    new SWAL(
      "Reservation",
      "Information de contact",
      "Confirmer",
      "Annuler",
      true,
      null,
      true
    )
      .form(arr)
      .then((response) => {
        new SWAL(
          "Processing...",
          "Just one moment",
          null,
          null,
          true
        ).alertFade(2500);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            genInfo: response,
            reservations: AllSeats.reservedSeats,
          }),
        };

        fetch(
          "https://www.sivantours.com/api/yamimNoraim/reserveSeats",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            if (result && result.payload) {
              if (
                result.payload.takenSeats &&
                result.payload.takenSeats.length > 0
              ) {
                blockInterimReservedSeats(result.payload.takenSeats);
              } else if (result.payload.success) {
                reservationComplete(result.payload);
              }
            } else {
              throw new Error("API not responding");
            }
          })
          .catch((error) => console.log("error", error));
      })
      .catch((e) => {
        $(DOM.reserve).click(reserveNow);
      });
  }
}

function reservationComplete(payload) {
  if (payload.reservationID) {
    const total = AllSeats.reservedSeats.reduce(
      (sum, obj) => sum + obj.price,
      0
    );
    var striptBtn = document.querySelector("#stripe-trigger");
    striptBtn.setAttribute("stripe-amount", total);
    const successURL = `https://www.greenshul.com/seatsConfirmed.html?r=${payload.reservationID}&s=true`;
    striptBtn.setAttribute("stripe-redirect-url", successURL);
    const failedURL = `https://www.greenshul.com/seatsConfirmed.html?r=${payload.reservationID}&s=false`;
    striptBtn.setAttribute("stripe-redirect-url", successURL);
    $(striptBtn).trigger("click");
  }
}

function blockInterimReservedSeats(arr) {
  const TS = Tools.tableReducer(arr);
  blockSeats(TS, `<i class="fa-solid fa-x"></i>`);
  Tools.updateAvailableSeats(AllSeats, holdSeat);
  arr.forEach((S) => {
    for (let i = 0; i < AllSeats.reservedSeats.length; i++) {
      const x = AllSeats.reservedSeats[i];
      if (x.table == S.table && x.seat == S.seat) {
        AllSeats.reservedSeats.splice(i, 1);
        break;
      }
    }
  });
  const qty = arr.length;
  new SWAL(
    "Petite Erreure",
    `Dans les dernières minutes,<br>${qty} de vos places ${
      qty == 1 ? "a" : "ont"
    } été réservée ${
      qty == 1 ? "" : "s"
    } par un autre participant.<br>(marqué avec un X)<br>Veuillez resélectionner.`,
    "ok"
  ).alert();
  updateDisplay(AllSeats);
  $(DOM.reserve).click(reserveNow);
}

function adminPortal() {
  if (adminMode === true) {
    $(".admin-area").slideUp();
    adminMode = false;
    DOM.adminLock.classList.remove("fa-lock-open");
    DOM.adminLock.classList.add("fa-lock");
    $(".seat").html("");
    $(".admin").removeClass("admin");
    $("#admin-print").hide();
  } else
    new SWAL("Admin", null, "Enter", "Cancel")
      .form([new FormElems("password", "password", "password")])
      .then((res) => {
        getAdminInfo(res.password);
      });
}
function getAdminInfo(pass) {
  var formdata = new FormData();
  formdata.append("password", pass);
  adminPassword = pass;
  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  fetch("https://www.sivantours.com/api/yamimNoraim/adminLogin", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (
        result &&
        result.payload &&
        result.payload.success &&
        result.payload.reservations &&
        result.payload.reservations.length
      ) {
        adminMode = true;
        DOM.adminLock.classList.remove("fa-lock");
        DOM.adminLock.classList.add("fa-lock-open");
        $("#admin-print").show();
        blockSeats(Tools.tableReducer(result.payload.reservations), null, true);
        Tools.updateAvailableSeats(AllSeats, holdSeat);
        $(".taken").addClass("admin");

        createReservationTable(adminOpened, result.payload.reservations);
        adminOpened = true;
        $(".admin-area").slideDown();
      } else throw new Error("Incorrect Password");
    })
    .catch((error) => {
      alert(error);
    });
}
document.querySelector("#admin-print").addEventListener("click", function () {
  var element = document.getElementById("shul");
  new SWAL(
    "Download Seat Map",
    "Voulez-vous télécharger le plan des sièges?",
    "Oui",
    "Non"
  )
    .confirm()
    .then(async () => {
      $(element).addClass("print");
      var opt = {
        margin: [0.25, 0],
        pagebreak: { mode: "avoid-all" },
        filename: "seat_map.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "tabloid", orientation: "portrait" },
      };

      // New Promise-based usage:
      await html2pdf().set(opt).from(element).save();
      $(element).removeClass("print");
    })
    .catch((e) => console.log(e));
});
