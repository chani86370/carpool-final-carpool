const express = require("express");
const router = express.Router();
const { createUser } = require('../controllers/usersController')
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  try {
    const response = await createUser(req,res);
    res.status(201).json(response.userID);
  }
  catch (err) {
    if (err.message == "Email already exist")
      res.status(400).send({ message: "Email already exist" });
    else
      res.status(500).send({ message: "Fail to fetch: " + err.message });
  }
});

module.exports = router;