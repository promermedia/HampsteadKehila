const { v4: uuidv4 } = require("uuid");
const cloudbackend = require("appdrag-cloudbackend");
cloudbackend.init(process.env.APIKEY, process.env.APPID);

exports.handler = async (req, context, callback) => {
  const BODY = JSON.parse(req.body);
  const Reservation = BODY.reservation;
  const Password = BODY.password;
  const returnedObj = {};
  const reservationID = uuidv4();

  await reserveSeat()
    .then((response) => {
      returnedObj.success = true;
      returnedObj.reservationID = reservationID;
      callback(null, returnedObj);
    })
    .catch((e) => {
      console.log(e);
      returnedObj.success = false;
      returnedObj.error = e;
      callback(null, returnedObj);
    });

  function reserveSeat() {
    return new Promise((resolve, reject) => {
      if (Password == "Sabbah2580") {
        const q =
          "INSERT INTO YM_seats (reservation_ID, f_name, l_name,`table`,seat, receipt_name) VALUES " +
          `('${reservationID}', '${Reservation.fName}','${Reservation.lName}','${Reservation.table}','${Reservation.seat}', 'ADMIN');`;
        cloudbackend.sqlExecuteRawQuery(q).then((response) => {
          const result = JSON.parse(response);
          if (!result) return reject("no_JSON");
          if (result.affectedRows && result.affectedRows > 0) {
            resolve();
          } else {
            reject({
              code: 500,
              reason: "Something wrong adding reservations.",
            });
          }
        });
      } else {
        reject("WRONG_PASSWORD");
      }
    });
  }
};
