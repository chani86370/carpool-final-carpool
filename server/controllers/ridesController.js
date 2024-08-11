const model = require('../models/ridesModel');

async function getRideBySourceAndDestination(source, destination, date) {
    try {
        return await model.getRideBySourceAndDestination(source, destination, date);
    } catch (err) {
        throw err;
    }
}

async function getRideById(id) {
    try {
        return await model.getRideById(id);
    } catch (err) {
        throw err;
    }
}

async function getRidesByUserId(userId, limit, offset) {
    try {
        return await model.getRidesByUserId(userId, limit, offset);
    } catch (err) {
        throw err;
    }
}

async function getRideByRideIdWithLocations(rideID) {
    try {
        return await model.getRideByRideIdWithLocations(rideID);
    } catch (err) {
        throw err;
    }
}


async function geNotApprovedRidesByUserId(userId) {
    try {
        return await model.geNotApprovedRidesByUserId(userId);
    } catch (err) {
        throw err;
    }
}

async function createRide(driverID, seats, source, destination, price, date, time, driverRemark, stops) {
    try {
        if (!date || !price || !seats || !destination || !source || !time) 
            throw new Error("you have to fill all field");
        if( !parseInt(seats)||!parseFloat(price))
            throw new Error("invalid input");
        const response = await model.createRide(driverID, seats, source, destination, price, date, time, driverRemark, stops);
        return { rideID: response.insertId };

    } catch (err) {
        throw err;
    }
}

async function updateRide(rideID, source, destination, seats, price, date, time, driverRemark, stops) {
    try {
        if (!date || !price || !seats || !destination || !source || !time) 
            throw new Error("you have to fill all field");
        if( !parseInt(seats)||!parseFloat(price))
            throw new Error("invalid input");
        const response = await model.updateRide(rideID,source, destination,seats, price, date, time, driverRemark, stops);
        return { rideID: response.insertId };

    } catch (err) {
        throw err;
    }
}



async function deleteRide(id) {
    try {
        return await model.deleteRide(id);
    } catch (err) {
        throw err;
    }
}

async function updateLikes(rideID, likes, dislikes) {
    try {
        const response = await model.updateLikes(rideID,likes, dislikes);
        return { rideID: response.insertId };

    } catch (err) {
        throw err;
    }
}

module.exports = { getRideBySourceAndDestination, getRideById, createRide, getRidesByUserId, updateRide,geNotApprovedRidesByUserId,getRideByRideIdWithLocations,updateLikes,deleteRide }
