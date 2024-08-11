const express = require("express");
const logOutRouter = express.Router();

logOutRouter.get('/', (req, res) => {
    res.cookie('jwt', '', { expires: new Date(0), path: '/' });
    res.status(200).send('Logged out');
});

module.exports = logOutRouter;