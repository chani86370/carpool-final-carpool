const model = require('../models/requestsModel');
async function createRequest(userID,rideID,stopID) {
    try {
        return await model.createRequest(userID,rideID,stopID);
    } catch (err) {
        throw err;
    }
}

module.exports = { createRequest  }