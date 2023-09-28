function createReservationTable(adminOpened, ARR) {
  if (adminOpened) {
    $("#all-reservations").dataTable().fnDestroy();
    $("#all-seats-reserved").dataTable().fnDestroy();
  }
  var seatsTableBody = "";
  const AllReservations = [];
  ARR.forEach((reservation) => {
    if (reservation.reservation_ID != "INOP") {
      seatsTableBody += `<tr id="${reservation.id}">
              <td>${reservation.l_name}</td>
              <td>${reservation.f_name}</td>
              <td>${reservation.table}</td>
              <td>${reservation.seat}</td>
            </tr>`;
      const { reservation_ID } = reservation;
      const existingEntry = AllReservations.find(
        (entry) => entry.reservation_ID === reservation_ID
      );
      if (existingEntry) {
        existingEntry.reservations.push(reservation);
      } else {
        AllReservations.push({ reservation_ID, reservations: [reservation] });
      }
    }
  });

  var tableBody = "";
  AllReservations.forEach((x) => {
    var mainRes = x.reservations[0];
    if (mainRes.receipt_name != "ADMIN") {
      var allSeats = x.reservations.map((y) => y.table + y.seat).join(", ");
      var price = x.reservations.reduce((sum, obj) => sum + obj.price, 0);
      var address = mainRes.address
        ? `${mainRes.address}, ${mainRes.city}, ${mainRes.province}, ${mainRes.postal}`
        : "";
      tableBody += `<tr id="${x.reservation_ID}">
              <td>${mainRes.receipt_name || ""}</td>
              <td>${allSeats}</td>
              <td>${mainRes.email || ""}</td>
              <td>${mainRes.cell || ""}</td>
              <td>${address}</td>
              <td>${price}</td>
            </tr>`;
    }
  });
  const ReservationTbody = document.querySelector("#all-reservations-tbody");
  ReservationTbody.innerHTML = tableBody;

  const AllSeatsTbody = document.querySelector("#all-seats-reserved-tbody");
  AllSeatsTbody.innerHTML = seatsTableBody;

  var q = "Reservations Yamim Noraim 5784 - 2023";
  DataTablesInit("#all-reservations", q, "reservationsYN2023");
  DataTablesInit("#all-seats-reserved", q, "seatsYN2023");
}

function DataTablesInit(id, q, excelName) {
  $(id).DataTable({
    order: [[0, "asc"]],
    pageLength: 50,
    dom: "lftpB",
    buttons: [
      {
        extend: "print",
        text: "Print These Results",
        className: "my-dt-button",
      },
      {
        extend: "excel",
        text: "Export Results as Excel",
        filename: excelName,
        messageTop: q,
      },
    ],
  });
}


export {createReservationTable}