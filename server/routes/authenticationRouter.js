const express = require("express");
const router = express.Router();
const { getById } = require('../controllers/usersController');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/", async (req, res) => {
    try {
        const response = await getById(req.user);
        res.send(response);
    } catch (err) {
        res.status(500).json({ error: "User creation failed" });
    }
});

module.exports = router;