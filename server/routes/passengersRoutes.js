const express = require("express");
const router = express.Router();
const { createPassenger } = require('../controllers/passengersController')
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { verifyJWT } = require('../middleWares/verifyJWT');
const { travelEligibilityCheck } = require('../middleWares/requestsMiddleWare');


router.put("/:requestId",verifyJWT,travelEligibilityCheck, async (req, res) => {
    try {
       const response =await createPassenger(req.params.requestId,req.body.state);  
       res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
});
module.exports = router;
