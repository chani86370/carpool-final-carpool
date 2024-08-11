const { getSmallRideById } = require('../models/ridesModel');

function checkDriverAge(req, res, next) {
    const birthDateDriver = req.body.birthDate;
    const age = new Date().getFullYear() - new Date(birthDateDriver).getFullYear();
    if (age >= 21) {
        next();
    } else {
        res.status(400).send({ message: "Driver must be above 21 years old." });
    }
}
async function checkIsTheDriver(req, res, next) {
    const rideID = req.params.rideID || req.body.rideId || req.params.id;
    const ride = await getSmallRideById(rideID);
    const driverID = ride[0].driverID;
    if (driverID === req.user)
        next()
    else
        res.status(403).send({ message: "You are not allowed to do this action" });
}

async function checkDriver(req, res, next) {
    if (req.body.driverID === req.user || req.params.userId == req.user) {
        next();
    }
    else
        res.status(403).send({ message: "You are not allowed to do this action" });

}

module.exports = { checkDriverAge, checkDriver, checkIsTheDriver }
