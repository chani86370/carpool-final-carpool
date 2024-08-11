const model = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function createUser(req,res) {
    if(!ValidateEmail(req.body.email)||!CheckPassword(req.body.password)){
        throw new Error("Wrong details");
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const response = await model.createUser(req.body.email, hashedPassword);
        const token = jwt.sign(
            { "userID": response.insertId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return {
            token,
            userID: response.insertId ,
        };
    } catch (err) {
        throw err;
    }
}

async function getWallet(userId, limit, offset) {
    try {
        const response = await model.getWallet(userId, limit, offset);
        return response;
    } catch (err) {
        throw err;
    }
}

async function getByPasswordAndEmail(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if(!ValidateEmail(email)||!CheckPassword(password)){
            throw new Error("Wrong details");
        }
        result = await model.getUserByPasswordAndEmail(email);
        if (result[0]) {
            if (bcrypt.compareSync(password, result[0].password)) {
                delete result[0].password;
                const token = jwt.sign(
                    { "userID": result[0].userID },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );
                res.cookie('jwt', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
                return {
                    token,
                    user:result[0] ,
                };
            }
            else {
                throw new Error('One or more of the details is incorrect');
            }
        }
        else {
            throw new Error('User does not exist, please sign up');
        }
    } catch (err) {
        throw err;
    }
}

async function getById(id) {
    try {
        return await model.getUser(id);
    } catch (err) {
        throw err;
    }
}

async function update(id, firstName, lastName, email, age, phone, picture, gender) {
    if (age == "" || gender == "" || phone == "" || lastName == "" || firstName == "" || phone == "") {
        throw new Error("Wrong details");
    }
    if(!validatePhone(phone)||!ValidateEmail(email)||!isValidBirthDate(age)){
        throw new Error("Wrong details");
    }
    try {
        return await model.updateUser(id, firstName, lastName, email, age, phone, picture, gender);
    } catch (err) {
        throw err;
    }
}

async function getUsersEmailsByRideID(rideID) {
    try {
        return await model.getUsersEmailsByRideID(rideID);
    } catch (err) {
        throw err;
    }
}

const validatePhone = (phone) => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    if ((phone).match(phoneNumberRegex)) {
      return true;
    }
    else {
      return false;
    }
  }

  const ValidateEmail = (email) => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ((email).match(mailformat)) {
      return true;
    } else {
      return false;
    }
  }

  function isValidBirthDate(birthDate) {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthDate).getFullYear();
    const age = currentYear - birthYear;
    if( age < 10 || age > 120){
        return false;
    }
    return true;
  }

  const CheckPassword = (password) => {
    const psw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
    if (password.match(psw)) {
        return true;
    } else {
        return false;
    }
};


module.exports = { getWallet, createUser, getById, update, getByPasswordAndEmail, getUsersEmailsByRideID }
