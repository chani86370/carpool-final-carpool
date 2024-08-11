const express = require("express");
const router = express.Router();
const { createRequest } = require('../controllers/requestsController')
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { checkUser } = require('../middleWares/usersMiddleWare')
const { checkIsNotDriver } = require('../middleWares/requestsMiddleWare')

router.post("/",checkUser,checkIsNotDriver, async (req, res) => {
    try {
       const response =await createRequest(req.body.userID,req.body.rideID,req.body.stopID);  
       res.status(200).send(response)  ;   
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
});
module.exports = router;