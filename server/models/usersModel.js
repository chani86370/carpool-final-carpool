const pool = require('../DB.js');

async function getUser(id) {
    try {
        const sql = 'SELECT * FROM users WHERE userID = ?';
        const result = await pool.query(sql, [id]);
        return result[0][0];
    } catch (err) {
        throw err;
    }
}

async function getUserByPasswordAndEmail(email) {
    try {
        const sql = 'SELECT * FROM carpool_db.users NATURAL JOIN carpool_db.passwords  WHERE users.email=?';
        const result = await pool.query(sql, [email]);
        return result[0];
    } catch (err) {
        throw err;
    }
}

async function createUser(email, hashedPassword) {
    try {
        const sql = "INSERT INTO users (`firstName`, `lastName`,`email`, `birthDate`,`phone`, `gender` ) VALUES(?,?, ?, ?, ?, ?)";
        const newUser = await pool.query(sql, [null, null, email, null, null, "Male"]);
        const sqlPassword = "INSERT INTO passwords (`userID`,`password`) VALUES(?,?)";
        const newPassword = await pool.query(sqlPassword, [newUser[0].insertId, hashedPassword]);
        return newUser[0];

    } catch (err) {
        if (err.sqlMessage == `Duplicate entry '${email}' for key 'users.email'`)
            throw new Error('email already exist');
        throw err;
    }
}

async function updateUser(id, firstName, lastName, email, age, phone, picture, gender) {
    try {
        const sql = `UPDATE users SET firstName = ?, lastName = ?, email = ?, birthDate = ?, phone = ?,picture=?, gender =? WHERE userID = ?`;
        const result = await pool.query(sql, [firstName, lastName, email,age , phone,picture, gender, id]);
        return result;

    } catch (err) {
        throw err;
    }
}


async function getUsersEmailsByRideID(rideID) {
    try {
        const sql = `select email,firstName from users NATURAL JOIN passengers where rideID=? `;
        const result = await pool.query(sql, [rideID]);
        return result[0];

    } catch (err) {
        throw err;
    }
}

async function getWallet(userId, limit, offset) {
    try {
        const sql = `
        SELECT 
            DATE_FORMAT(date, '%m/%y') AS month,
            SUM(IF(driverID = ?, price * passengers, 0)) AS income,
            SUM(IF(userID = ?, price * -1, 0)) AS expenses,
            MAX(date) AS max_date  
        FROM rides
        LEFT JOIN passengers ON rides.rideID = passengers.rideID
        WHERE rides.date <= ? and rides.status="Active"
        GROUP BY month
        ORDER BY max_date DESC
        LIMIT ? OFFSET ?;
    `;
        const currentDate = new Date().toISOString().split('T')[0];
        const wallet = await pool.query(sql, [userId, userId, currentDate, parseInt(limit), parseInt(offset)]);
        return wallet[0];

    } catch (err) {
        throw err;
    }
}

module.exports = {getWallet, updateUser, getUser, createUser, getUserByPasswordAndEmail,getUsersEmailsByRideID }