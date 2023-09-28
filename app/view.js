import { FormElems } from "../swal/constructors/formelems";

const DOM = {
  seatsNamesDisplay: document.getElementById("seats-selected"),
  reserve: document.getElementById("reserve-now"),
  amountToPay: document.getElementById("amount-to-pay"),
  adminLock: document.getElementById("admin-lock"),
  triggerAllSeatsReserved: document.getElementById(
    "trigger-all-seats-reserved"
  ),
  triggerAllReservations: document.getElementById("trigger-all-reservations"),
};

$(DOM.triggerAllSeatsReserved).click(function () {
  $(".res-table-container").hide();
  $("#container-all-seats-reserved").slideDown();
  location.href = "#trigger-all-seats-reserved";
});

$(DOM.triggerAllReservations).click(function () {
  $(".res-table-container").hide();
  $("#container-all-reservations").slideDown();
  location.href = "#trigger-all-reservations";
});

function createReserveForm(TempName, Prices) {
  return [
    new FormElems(
      "text",
      "prénom",
      "fName",
      "",
      null,
      null,
      true,
      "",
      "",
      TempName.fName
    ),
    new FormElems(
      "text",
      "nom",
      "lName",
      "",
      null,
      null,
      true,
      "",
      "",
      TempName.lName
    ),
    new FormElems(
      "checkbox",
      "",
      "rebate",
      "",
      [{ val: 1, text: "étudiant(e) / enfant" }],
      rebateChange()
    ),
  ];

  function rebateChange() {
    return {
      event: "change",
      func: function (e) {
        const span = document.querySelector("#price-in-swal");
        span.innerText =
          e.target.checked === true ? Prices.rebate : Prices.selected;
      },
    };
  }
}

function updateDisplay(AllSeats) {
  DOM.seatsNamesDisplay.innerText =
    AllSeats.reservedSeats.length == 0
      ? originalText
      : AllSeats.reservedSeats.map((x) => x.table + x.seat).join(", ");

  DOM.amountToPay.innerText = AllSeats.reservedSeats.reduce(
    (sum, obj) => sum + obj.price,
    0
  );
}

function reservationForm(AllSeats) {
  return [
    new FormElems(
      "text",
      "Nom pour reçu",
      "receipt_name",
      "",
      null,
      null,
      true,
      "",
      "",
      AllSeats.reservedSeats[0].fName + " " + AllSeats.reservedSeats[0].lName
    ),
    new FormElems("text", "Numéro de cel.", "cel", "", null, null, true),
    new FormElems("text", "Addresse courriel", "email", "", null, null, true),
    new FormElems("text", "Adresse", "address", "", null, null, true),
    new FormElems("text", "Code Postal", "postal", "", null, null, true),
    new FormElems(
      "text",
      "Ville",
      "city",
      "",
      null,
      null,
      true,
      "",
      "",
      "Montréal"
    ),
    new FormElems(
      "text",
      "Province",
      "province",
      "",
      null,
      null,
      true,
      "",
      "",
      "Québec"
    ),
  ];
}


export {
  DOM,
  createReserveForm,
  updateDisplay,
  reservationForm,
  
};
