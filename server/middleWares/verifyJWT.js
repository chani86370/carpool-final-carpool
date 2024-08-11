const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyJWT(req, res, next){
    const cookieToken = req.cookies.jwt;
    if (!cookieToken){
        return res.status(401).send({ message: "Access token not found" });
    }
   
    jwt.verify(
        cookieToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403).send({ message: "invalid token" }); 
            }
            req.user = decoded.userID; 
            next();
        }
    );
}
module.exports = {verifyJWT};
