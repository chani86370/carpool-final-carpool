const pool = require('../DB.js');
async function createPassengerOnRide(id, state) {
  try {
   
      const sqlr = "select * from travel_requests where id=?"
      const request = await pool.query(sqlr, [id]);
      if (state !== "unConfirmed") {
      const sql = "INSERT INTO passengers (`rideID`, `userID`,`stopID` ) VALUES(?,?,?)";
      const newPassenger = await pool.query(sql, [request[0][0].rideID, request[0][0].userID, request[0][0].stopID]);
    }
    const sqlRideUpdate= "UPDATE Rides SET `passengers` =passengers+1 WHERE `rideID` = ?"
    const rideUpdate = await pool.query(sqlRideUpdate,  [request[0][0].rideID]);
    const sqlr1 = " UPDATE travel_requests SET `status` = ? WHERE `id` = ?"
    const confirm = await pool.query(sqlr1, [state, id])
    const sqlRide = `select s.locationName as source,d.locationName as destination,email,date 
                     from rides,Locations s, Locations d,users where s.locationID=sourceID and d.locationID=destinationID and rideID=? && userID=?`
    const ride = await pool.query(sqlRide, [request[0][0].rideID, request[0][0].userID]);
    return ride[0][0];
  } catch (err) {
    throw err;
  }
}

module.exports = { createPassengerOnRide }