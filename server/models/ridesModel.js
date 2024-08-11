const pool = require('../DB.js');

async function getRideBySourceAndDestination(source, destination, date) {
    if (source && destination) {
        try {
            const sql = `SELECT DISTINCT 
            r.rideID,
            r.time, 
            r.date, 
            r.price, 
            r.seats, 
            r.passengers, 
            r.rideID, 
            s.locationName AS source, 
            d.locationName AS destination
        FROM 
            rides r
            LEFT JOIN stops st ON r.rideID = st.rideID
            LEFT JOIN locations s ON r.sourceID = s.locationID OR st.locationID = s.locationID
            LEFT JOIN locations d ON r.destinationID = d.locationID OR st.locationID = d.locationID
        WHERE 
            s.locationName = ? 
            AND d.locationName = ? 
            AND r.date = ? 
            AND r.date > ? 
            AND r.passengers < r.seats 
            AND r.status = "Active"`;
            const result = await pool.query(sql, [source, destination, date, new Date()]);
            return result[0];
        } catch (err) {
            throw err;
        }
    }
    else {
        try {
            const sql = `SELECT
    r.time,
    r.date,
    r.price,
    r.seats,
    r.passengers,
    r.rideID,
    s.locationName AS source,
    s.lat AS source_lat,
    s.lon AS source_lon,
    d.locationName AS destination,
    d.lat AS destination_lat,
    d.lon AS destination_lon
FROM
    Rides r
    JOIN Locations s ON r.sourceID = s.locationID
    JOIN Locations d ON r.destinationID = d.locationID
WHERE
    r.date = ? and r.status="Active"  AND r.date > ?  AND r.passengers < r.seats ;`;
            const result = await pool.query(sql, [date, new Date()]);
            return result[0];
        } catch (err) {
            throw err;
        }
    }
}

async function getRideById(rideID) {
    try {
        const sql = `SELECT users.*, s.locationName as source,d.locationName as destination,rideID,passengers,seats,price,date,time,driverRemark
        FROM rides r , Locations s, Locations d,users 
        WHERE rideID=? and userID=driverID and s.locationID=sourceID and d.locationID=destinationID and r.status="Active"`;
        const result = await pool.query(sql, [rideID]);
        const sqlStops = `SELECT stopID,locationName as stopLocation
        FROM stops natural join locations WHERE rideID=? `;
        const stopsResult = await pool.query(sqlStops, [rideID]);
        const sqlDriverLikes = `SELECT 
                            SUM(likes) AS likes, 
                            SUM(dislikes) AS dislikes 
                        FROM Rides 
                        WHERE driverID = ?`;

        const driverLikesResult = await pool.query(sqlDriverLikes, [result[0][0].userID]);
        result[0][0] = {
            ...driverLikesResult[0][0],
            ...result[0][0],
            stops: stopsResult[0]
        };
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function getSmallRideById(rideID) {
    try {
        const sql = `SELECT driverID from rides where rideID=?`;
        const result = await pool.query(sql, [rideID]);
        return result[0];
    } catch (err) {
        throw err;
    }
}
async function getRideByRideIdWithLocations(rideID) {
    try {
        const sql = `SELECT users.*, s.locationName as source,s.lat as sourceLat ,s.lon as sourceLon ,d.locationName as destination,d.lat as destinationLat ,d.lon as destinationLon,rideID,passengers,seats,price,date,time,driverRemark
        FROM rides r , Locations s, Locations d,users 
        WHERE rideID=? and userID=driverID and s.locationID=sourceID and d.locationID=destinationID`;
        const result = await pool.query(sql, [rideID]);

        if (result[0] && result[0][0]) {
            let ride = result[0][0];
            ride.date = new Date(ride.date);
            const offset = ride.date.getTimezoneOffset();
            ride.date = new Date(ride.date.getTime() - (offset * 60 * 1000));
            ride.date = ride.date.toISOString().split('T')[0];
        }

        const sqlStops = `SELECT stopID,locationName as name,lat,lon
        FROM stops natural join locations WHERE rideID=?`;
        const stopsResult = await pool.query(sqlStops, [rideID]);
        result[0][0] = {
            ...result[0][0],
            stops: stopsResult[0]
        };
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function getRidesByUserId(userId, limit, offset) {
    try {
        const sql = `
           (
    SELECT r.*, s.locationName as source, d.locationName as destination, NULL AS userID
    FROM rides r
    JOIN Locations s ON s.locationID = r.sourceID
    JOIN Locations d ON d.locationID = r.destinationID
    WHERE r.driverID =? 
)
UNION
(
    SELECT r.*, s.locationName as source, d.locationName as destination, p.userID
    FROM rides r
    JOIN Locations s ON s.locationID = r.sourceID
    JOIN Locations d ON d.locationID = r.destinationID
    JOIN passengers p ON r.rideID = p.rideID
    WHERE p.userID =? and r.status="Active"
)
ORDER BY date DESC, time DESC
LIMIT ? OFFSET ?; `;
        const result = await pool.query(sql, [userId, userId, parseInt(limit), parseInt(offset)]);
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function geNotApprovedRidesByUserId(userId) {
    try {
        const sql = `
  select r.*,s.locationName as source, d.locationName as destination,t.status
          from travel_requests t natural join Rides r JOIN Locations s ON s.locationID = r.sourceID
    JOIN Locations d ON d.locationID = r.destinationID
    where  t.userID=? and t.status !="confirmed" and r.status="Active"  
        `;
        const result = await pool.query(sql, [userId]);
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function createRide(driverID, seats, source, destination, price, date, time, driverRemark, stops) {
    try {
        const sqlLoactins = "INSERT INTO locations (`locationName`,`lat`,`lon` ) VALUES(?,?, ?),(?,?,?)"
        const newLocations = await pool.query(sqlLoactins, [source.name, source.lat, source.lon, destination.name, destination.lat, destination.lon]);
        const sql = "INSERT INTO rides (`driverID`,`passengers`, `seats`,`sourceID`, `destinationID`,`price`,`date`,`time`, `driverRemark` ) VALUES(?,?, ?, ?, ?, ?,?,?,?)";
        const newRide = await pool.query(sql, [driverID, 0, seats, newLocations[0].insertId, newLocations[0].insertId + 1, price, date, time, driverRemark]);
        if (stops[0]) {
            stops.forEach(async stop => {
                const sqlStopLocation = "INSERT INTO locations (`locationName`,`lat`,`lon` ) VALUES(?,?, ?)";
                const newStopLocation = await pool.query(sqlStopLocation, [stop.name, stop.lat, stop.lon]);
                const sqlStop = "INSERT INTO stops (`rideID`,`locationID` ) VALUES(?,?)";
                const newStop = await pool.query(sqlStop, [newRide[0].insertId, newStopLocation[0].insertId]);
            });
        }
        return newRide[0];

    } catch (err) {
        throw err;
    }
}

async function deleteRide(id) {
    try {
        const sql = "UPDATE rides SET status = 'NotActive' WHERE rideID = ?";
        const deletingRide = await pool.query(sql, [id]);
        const updatePassengersSql = `
        UPDATE passengers 
        SET stopID = NULL 
        WHERE stopID IN (SELECT stopID FROM stops WHERE rideID = ?)
    `;
        await pool.query(updatePassengersSql, [id]);
        const deleteStopsSql = "DELETE FROM stops WHERE rideID = ?";
        await pool.query(deleteStopsSql, [id]);
        const deleteOrphanLocationsSql = `
        DELETE FROM Locations 
        WHERE locationID NOT IN (
            SELECT sourceID FROM rides
            UNION
            SELECT destinationID FROM rides
            UNION
            SELECT locationID FROM stops
        )
    `;
        await pool.query(deleteOrphanLocationsSql);
        return deletingRide[0];
    } catch (err) {
        throw err;
    }
}

async function updateRide(rideID, source, destination, seats, price, date, time, driverRemark, stops) {
    try {
        const sorecIDdestinationIDForDeletesql = `SELECT s.locationID as sourceID,d.locationID as destinationID
        FROM Locations s, Locations d,rides 
        WHERE rideID=? and s.locationID=sourceID and d.locationID=destinationID`;
        const sorecIDdestinationIDForDelete = await pool.query(sorecIDdestinationIDForDeletesql, [rideID]);
        const updateSourceDestinationLocation = `UPDATE Locations
        SET locationName = ?, lat = ?, lon = ?
        WHERE locationID = ?`;
        const updateSourceLocationResult = await pool.query(updateSourceDestinationLocation, [source.locationName, source.lat, source.lon, sorecIDdestinationIDForDelete[0].sourceID]);
        const updateDestinationLocationResult = await pool.query(updateSourceDestinationLocation, [destination.locationName, destination.lat, destination.lon, sorecIDdestinationIDForDelete[0].destinationID]);

        const sqlStopsLocation = `SELECT locationID
                                  FROM stops natural join locations
                                  WHERE rideID=?`;
        const stopsLocationIDResult = await pool.query(sqlStopsLocation, [rideID]);
        const sqlDeleteStops = `DELETE FROM Stops WHERE rideID = ?`;
        const sqlDeleteStopsResult = await pool.query(sqlDeleteStops, [rideID]);
        const sqlDeleteStopsLoactins = `DELETE FROM locations WHERE locationID = ?`;
        stopsLocationIDResult[0]?.forEach(async locationID => {
            const stopsLocationIDResult = await pool.query(sqlDeleteStopsLoactins, [locationID.locationID]);
        });
        if (stops.length > 0) {
            stops.forEach(async stop => {
                const sqlInsertStopLocation = "INSERT INTO locations (`locationName`,`lat`,`lon` ) VALUES(?,?, ?)";
                const newStopLocation = await pool.query(sqlInsertStopLocation, [stop.name, stop.lat, stop.lon]);
                const sqlInsertStop = "INSERT INTO stops (`rideID`,`locationID` ) VALUES(?,?)";
                const newStop = await pool.query(sqlInsertStop, [rideID, newStopLocation[0].insertId]);
            });
        };

        const sql = `UPDATE rides SET seats = ?,price = ?, date = ?, time = ?, driverRemark =? WHERE rideID = ?`;
        const result = await pool.query(sql, [seats, price, date, time, driverRemark, rideID]);
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function updateLikes(rideID, likes, dislikes) {
    try {
        const sql = `UPDATE rides SET likes = ?,dislikes = ? WHERE rideID = ?`;
        const result = await pool.query(sql, [likes, dislikes, rideID]);
        return result[0];
    } catch (err) {
        throw err;
    }
}

module.exports = { getSmallRideById, deleteRide, getRideBySourceAndDestination, getRideById, createRide, getRidesByUserId, updateRide, getRideByRideIdWithLocations, geNotApprovedRidesByUserId, updateLikes }
