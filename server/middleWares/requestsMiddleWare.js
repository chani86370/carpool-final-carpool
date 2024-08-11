const { getDriverIDByRequestID,getDriverIDByRideID } = require('../models/requestsModel');


async function travelEligibilityCheck(req, res, next) {
    const driver = await getDriverIDByRequestID(req.params.requestId);
    const driverID=driver[0].driverID;
    if (req.user==driverID) {
        next();
    } else {
        res.status(403).send({ message: "The ride is not yours - you cannot confirm it " });
    }
}

async function checkIsNotDriver(req, res, next) {
    const driverID = await getDriverIDByRideID(req.body.rideID);
    if (driverID !== req.body.userID ) {
        next();
    }
    else
        res.status(403).send({ message: "You are not allowed to register to your travel" });

}


module.exports = {travelEligibilityCheck,checkIsNotDriver}