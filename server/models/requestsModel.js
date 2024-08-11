const pool = require('../DB.js');
async function createRequest(userID,rideID,stopID) {
    try {
        const userExist="select id from travel_requests where rideID=? and userID=?";
        const user = await pool.query(userExist, [rideID,userID]);
        if(user[0].length>0)
        {
            throw new Error('you cant register twice to the same ride');
        }
        const sql = "INSERT INTO travel_requests (`userID`,`rideID`, `stopID`, `status` ) VALUES(?,?,?,?)";
        const newRide = await pool.query(sql, [userID, rideID, stopID, "waiting"]);
        return newRide[0];

    } catch (err) {
        throw err;
    }
}
async function getDriverIDByRequestID(id) {
    try {
        const sql = `SELECT driverID
        FROM travel_requests tr
        JOIN rides r ON tr.rideID = r.rideID 
         WHERE tr.id = ?`;
        const driverID = await pool.query(sql,[id]);
        return driverID[0];

    } catch (err) {
        throw err;
    }
}


async function getDriverIDByRideID(rideID) {
    try {
        const sql = `SELECT driverID
        FROM rides r
         WHERE r.rideID = ?`;
        const driverID = await pool.query(sql,[rideID]);
        return driverID[0][0].driverID;

    } catch (err) {
        throw err;
    }
}

module.exports = { createRequest,getDriverIDByRequestID,getDriverIDByRideID}