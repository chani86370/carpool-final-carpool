
async function checkUser(req, res, next) {
    if (req.user==req.body.userID||req.params.id==req.user) {
        next();
    } else {
        res.status(403).send({ message: "you unconfirm to do it " });
    }
}
module.exports = {checkUser}