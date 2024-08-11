const express = require('express');
const path = require('path');
const cors = require('cors'); 
const app = express();
app.use(express.urlencoded({ extended: true }));
const port = 3000;
app.use(cors({ origin: 'http://localhost:5173', 
  credentials: true}));
app.use(express.static('public'));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const {verifyJWT}=require("./middleWares/verifyJWT");
const authenticationRouter = require("./routes/authenticationRouter")
app.use("/authentication",verifyJWT,authenticationRouter);
const usersRouter = require("./routes/usersRoutes")
app.use("/users",verifyJWT,usersRouter);
const logInRouter = require("./routes/logInRoutes")
app.use("/logIn",logInRouter);
const registerRouter = require("./routes/registerRoutes")
app.use("/register",registerRouter);
const rideRouter = require("./routes/ridesRoutes")
app.use("/rides",rideRouter);
const passengersRouter = require("./routes/passengersRoutes")
app.use("/passengers",verifyJWT,passengersRouter);
const requestsRouter = require("./routes/requestsRoutes");
app.use("/requests",verifyJWT,requestsRouter);
const logOutRouter = require("./routes/logOutRouter");
app.use("/logOut",verifyJWT,logOutRouter);
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
