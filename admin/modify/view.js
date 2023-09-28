import { FormElems } from "../../swal/constructors/formelems";

export default {
  form: function (AllSeats, obj) {
    var paymentToggle = null;
    if (obj.receipt_name == "ADMIN") {
      var paid = obj.paid == 1 ? true : false;
      paymentToggle = new FormElems("checkbox", "", "payment_toggle", "", [
        { val: 1, text: "Cocher si siège est payé", checked: paid },
      ]);
    }
    const TableOpts = AllSeats.availableObjects
      .map((x) => x.table)
      .sort()
      .map((x) => {
        return { val: x, text: x };
      });
    const TableChange = {};
    TableChange.event = "change";
    TableChange.func = function () {
      $(".real-seat-select").parent().hide();
      if (this.value) {
        var tableID = this.value;
        const TableWithThisVal = document.querySelectorAll(
          `div[table='${tableID}']`
        );
        const SeatsInThisTable = [];
        TableWithThisVal.forEach((x) => {
          x.querySelectorAll(".seat").forEach((z) => {
            if (!z.getAttribute("inop"))
              SeatsInThisTable.push(z.getAttribute("seat"));
          });
        });

        var select = document.querySelector(".real-seat-select").parentElement;
        var first = select.querySelector("li:first-child");
        var selectOptions = select.querySelectorAll("option");
        selectOptions.forEach((x) => (x.selected = false));
        $(select).find("li").hide();
        select
          .querySelectorAll(".selected")
          .forEach((x) => x.classList.remove("selected"));

        first.className = "selected";
        select.querySelector(".select-dropdown").value = first.innerText;

        var theseSeats = AllSeats.availableObjects.find(
          (x) => x.table == tableID
        ).seats;
        var LIs = select.querySelectorAll("li");
        for (let i = 0; i < LIs.length; i++) {
          const li = LIs[i];
          li.setAttribute("seat-id", selectOptions[i].value);
        }

        if (theseSeats && theseSeats.length > 0) {
          LIs.forEach((l) => {
            var seatID = l.getAttribute("seat-id");
            if (
              SeatsInThisTable.includes(seatID) &&
              theseSeats.some((x) => x == seatID)
            ) {
              $(l).show();
            }
          });
          $(first).show();
          $(".real-seat-select").parent().slideDown();
        }
      }
    };
    const tableSelect = new FormElems(
      "select",
      "Table",
      "table",
      "table-select inline-block",
      TableOpts,
      TableChange,
      true
    );
    const SeatOpts = [];
    for (let index = 1; index <= 19; index++) {
      SeatOpts.push({ val: index, text: index });
    }
    const seatSelect = new FormElems(
      "select",
      "Seat",
      "seat",
      "seat-select inline-block hide-first",
      SeatOpts,
      null,
      true
    );
    var arr = [
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
        obj.f_name
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
        obj.l_name
      ),
     
    ];

    if (paymentToggle) arr.push(paymentToggle);

    arr.push(
      new FormElems(
        "checkbox",
        "",
        "just_name",
        "",
        [{ val: 1, text: "Je modifie juste le nom" }],
        justNameChange()
      ),
      tableSelect,
      seatSelect
    );
    return arr;

    function justNameChange() {
      return {
        event: "change",
        func: function (e) {
          if (e.target.checked === true) {
            $("select[name='table']")
              .attr("required", false)
              .parent()
              .slideUp();
            $("select[name='seat']").attr("required", false);
          } else {
            $("select[name='table']")
              .attr("required", true)
              .parent()
              .slideDown();
            $("select[name='seat']").attr("required", true);
          }
        },
      };
    }
  },
};
