const model = require('../models/passengersModel');
async function createPassenger(id,state) {
    try {
        if(!state)
            throw new Error("you have to fill all field");
        return await model.createPassengerOnRide(id,state);
    } catch (err) {
        throw err;
    }
}

module.exports = { createPassenger  }