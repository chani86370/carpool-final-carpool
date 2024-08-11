const express = require("express");
const router = express.Router();
const { getWallet, getById, update, getUsersEmailsByRideID } = require('../controllers/usersController')
const { checkUser } = require('../middleWares/usersMiddleWare')
const { checkIsTheDriver } = require('../middleWares/rideMiddleWare');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const path = require('path');
const multer = require('multer');
const uploadDir = path.join(__dirname, '../public/uploads');
const fs = require('fs');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.put("/:id",checkUser, upload.single('picture'), async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.body.user?JSON.parse(req.body.user):req.body;
        const picture = req.file ? `uploads/${req.file.filename}` : user.picture; // קבלת הנתיב של התמונה
        await update(id, user.firstName, user.lastName, user.email, user.birthDate, user.phone, picture, user.gender);
        res.status(200).send(await getById(id));
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
});
router.get("/wallet/:id", checkUser, async (req, res) => {
    try {
        const response = await getWallet(req.params.id, req.query.limit, req.query.offset);
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send({ message: "Fail to fetch: " + err.message });
    }
});
router.get("/emails/:rideID", checkIsTheDriver, async (req, res) => {
    try {
        const rideID = req.params.rideID;
        const emails = await getUsersEmailsByRideID(rideID)
        res.status(200).send(emails);

    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;