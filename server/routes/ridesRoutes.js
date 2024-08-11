const express = require("express");
const router = express.Router();
const { getRideBySourceAndDestination,updateRide,deleteRide, getRideByRideIdWithLocations,getRideById, createRide, getRidesByUserId,geNotApprovedRidesByUserId,updateLikes } = require('../controllers/ridesController');
const { checkDriverAge } = require('../middleWares/rideMiddleWare');
const { checkIsTheDriver,checkDriver } = require('../middleWares/rideMiddleWare');
const { verifyJWT } = require('../middleWares/verifyJWT');
const { checkUser } = require("../middleWares/usersMiddleWare");
const { checkIsNotDriver } = require("../middleWares/requestsMiddleWare");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.route("/")
  .get(async (req, res) => {
    try {
      const response = await getRideBySourceAndDestination(req.query.source, req.query.destination, req.query.date);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  })
  .post(verifyJWT,checkDriver,checkDriverAge, async (req, res) => {
    try {
      const response = await createRide(
        req.body.driverID,
        req.body.seats,
        req.body.source,
        req.body.destination,
        req.body.price,
        req.body.date,
        req.body.time,
        req.body.driverRemark,
        req.body.stops);
      res.status(201).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    try {
      const response = await getRideById(req.params.id);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  })
.put(verifyJWT,checkIsTheDriver,async (req, res) => {
    try {
      const response = await updateRide(
        req.body.rideID,
        req.body.source,
        req.body.destination,
        req.body.seats,
        req.body.price,
        req.body.date,
        req.body.time,
        req.body.driverRemark,
        req.body.stops);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  })
  .delete(verifyJWT,checkIsTheDriver,async (req, res) => {
    try {
      const response = await deleteRide(req.params.id);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  })

router.route("/myRides/:userId")
  .get(verifyJWT,checkDriver,async (req, res) => {
    try {
      const response = await getRidesByUserId(req.params.userId, req.query.limit, req.query.offset);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  });




  router.route("/myRides/:userId/notApproved")
  .get(verifyJWT,checkDriver,async (req, res) => {
    try {
      const response = await geNotApprovedRidesByUserId(req.params.userId);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  });

router.route("/:rideID/likes")
  .put(verifyJWT,checkUser,checkIsNotDriver,async (req, res) => {
    try {
      const response = await updateLikes(req.params.rideID, req.body.likes, req.body.dislikes);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  });

  router.route("/edit/:rideID")
  .get(verifyJWT,checkIsTheDriver,async (req, res) => {
    try {
      const response = await getRideByRideIdWithLocations(req.params.rideID);
      res.status(200).send(response);
    }
    catch (err) {
      res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
  });

module.exports = router;