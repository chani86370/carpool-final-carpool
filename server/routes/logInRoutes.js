const express = require("express");
const router = express.Router();
const { getByPasswordAndEmail } = require('../controllers/usersController')
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
require('dotenv').config();

router.post("/", async (req, res) => {
    try {
        userAndToken = await getByPasswordAndEmail(req, res);
        return res.status(200).json(userAndToken.user);
    }
    catch (err) {
        if (err.message == 'Unauthorized')
            return res.status(401).json({ message: 'Unauthorized' });
        if (err.message == "User does not exist, please sign up")
            res.status(400).send({ message: "User does not exist, please sign up" });
        if (err.message == "One or more of the details is incorrect")
            res.status(400).send({ message: "One or more of the details is incorrect" });
        else
            res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
});

module.exports = router;
