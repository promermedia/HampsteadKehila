function updateContentPadding() {
  const header = document.querySelector("#shul-header");
  const content = document.querySelector("#shul");

  const headerHeight = header.offsetHeight;
  content.style.paddingTop = headerHeight + "px";
}

window.addEventListener("load", updateContentPadding);
window.addEventListener("resize", updateContentPadding);

const seatsNamesDisplay = document.getElementById("seats-selected");
const originalText = "Vous n'avez pas encore sélectionné de sièges.";

const AllSeats = {
  takenSeats: [],
  availableSeats: [],
  reservedSeats: [],
};

fetch("https://www.sivantours.com/api/yamimNoraim/getReservations")
  .then((res) => res.json())
  .then((data) => {
    if (data && data.Table && data.Table.length > 0) {
      AllSeats.takenSeats = data.Table.reduce((result, current) => {
        const existingTable = result.find(
          (item) => item.table === current.table
        );
        if (existingTable) {
          existingTable.seats.push(current.seat);
        } else {
          result.push({ table: current.table, seats: [current.seat] });
        }
        return result;
      }, []);
      blockSeats();
    }
    AllSeats.availableSeats = document.querySelectorAll(".seat:not(.taken)");
    AllSeats.availableSeats.forEach((x) => {
      x.taken = false;
      x.addEventListener("click", holdSeat);
    });
  });

function blockSeats() {
  AllSeats.takenSeats.forEach((x) => {
    if (x.seats.length > 0) {
      const T = x.table;
      const S = x.seats;
      const Tables = document.querySelectorAll(`div[table='${T}']`);

      S.forEach((s) => {
        for (let Table of Tables) {
          const seat = Table.querySelector(`div[seat='${s}']`);
          if (seat) {
            seat.classList.add("taken");
            break;
          }
        }
      });
    }
  });
}

function holdSeat() {
  const That = this;
  const table = That.parentElement.getAttribute("table");
  const seatNum = That.getAttribute("seat");
  if (That.taken == false) {
    const seat = new Seat(table, parseInt(seatNum), That);
    AllSeats.reservedSeats.push(seat);
    That.taken = true;
    That.innerHTML = `<i class="fa-solid fa-check"></i>`;
  } else {
    for (let i = 0; i < AllSeats.reservedSeats.length; i++) {
      const x = AllSeats.reservedSeats[i];
      if (x.table == table && x.seat == seatNum) {
        AllSeats.reservedSeats.splice(i, 1);
        break;
      }
    }
    That.taken = false;
    That.innerHTML = "";
  }
  updateDisplay();
}

function updateDisplay() {
  seatsNamesDisplay.innerText =
    AllSeats.reservedSeats.length == 0
      ? originalText
      : AllSeats.reservedSeats.map((x) => x.table + x.seat).join(", ");
}

class Seat {
  constructor(_table, _seat, _HTML) {
    this.table = _table;
    this.seat = _seat;
    this.HTML = _HTML;
  }
}
