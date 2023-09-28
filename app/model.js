export const Tools = {
  tableReducer: function (ARR) {
    return ARR.reduce((result, current) => {
      const existingTable = result.find((item) => item.table === current.table);
      if (existingTable) {
        existingTable.seats.push(current);
      } else {
        result.push({ table: current.table, seats: [current] });
      }
      return result;
    }, []);
  },
  updateAvailableSeats: function (AllSeats, holdSeat) {
    $(".seat").off("click", holdSeat);
    AllSeats.availableObjects = [];
    AllSeats.availableSeats = document.querySelectorAll(".seat:not(.taken)");
    AllSeats.availableSeats.forEach((x) => {
      const table = x.parentElement.getAttribute("table");
      const seatNum = x.getAttribute("seat");
      var foundTable = AllSeats.availableObjects.find((z) => z.table == table);
      if (foundTable) {
        foundTable.seats.push(seatNum);
      } else {
        AllSeats.availableObjects.push({ table: table, seats: [seatNum] });
      }
      x.taken = false;
      $(x).click(holdSeat);
    });
  },
};
