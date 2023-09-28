import { SWAL } from "../../swal/controller";

export default function modifySeat(obj, seatDiv, arr, adminPassword, callback) {
  new SWAL(`Modifier Siège ${obj.table + obj.seat}`, null, "OK", "Annuler")
    .form(arr)
    .then((res) => {
      console.log(res);
      if (!res.table) res.table = seatDiv.parentElement.getAttribute("table");
      if (!res.seat) res.seat = seatDiv.getAttribute("seat");
      var IsPaid =
        res.checkboxes &&
        res.checkboxes.payment_toggle &&
        res.checkboxes.payment_toggle.length > 0 &&
        res.checkboxes.payment_toggle[0] == "1"
          ? 1
          : 0;
        if(!res.checkboxes.payment_toggle) {
          IsPaid = 1
        }
      var settings = {
        url: "https://www.sivantours.com/api/yamimNoraim/modifySeat",
        data: {
          fName: res.fName,
          lName: res.lName,
          table: res.table,
          seat: res.seat,
          paid: IsPaid,
          id: obj.id,
          reservationID: obj.reservation_ID,
        },
        method: "POST",
        async: true,
        crossDomain: true,
        processData: true,
      };
      $.ajax(settings).done(function (response) {
        if (response && response.affectedRows == 1) {
          obj.paid = IsPaid;
          $(seatDiv).removeClass("unpaid")
          if (IsPaid == 0) $(seatDiv).addClass("unpaid");
          callback(adminPassword);
        }
      });
    });
}
