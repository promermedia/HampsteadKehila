export default function adminAddsReservation(seat,adminPassword, callback) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    reservation: {
      table: seat.table,
      seat: seat.seat,
      fName: seat.fName,
      lName: seat.lName,
    },
    password: adminPassword,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://www.sivantours.com/api/yamimNoraim/adminAddReservation",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.payload.success) {
        callback(seat.HTML, seat.fName + " " + seat.lName);
      } else alert("Wrong Password");
    })
    .catch((error) => console.log("error", error));
}