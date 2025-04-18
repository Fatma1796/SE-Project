const express = require("express");
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const cors = require("cors");
const eventRouter = require("./Routes/Event");
const app = express();
const bookingRouter = require("./Routes/booking");

const userRouter = require("./Routes/user");
const { authenticateUser, authorizeRoles } = require('./Middleware/authenticationMiddleware');
//fixed the path of authenticationMiddleware to use relative path

//const authRouter = require("./Routes/auth");
//const authenticationMiddleware = require('./Middleware/authenticationMiddleware');
//const authenticationMiddleware=require('C:\Users\My Lap\Documents\sem 4\Software Engneering\SE-Project\Middleware\authenticationMiddleware.js')


require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// used authenticationMiddleware as we do not have route/auth
// // Protect all /api/v1/users routes with authentication middleware
app.use("/api/v1/users", userRouter);

// Example admin route with role-based access control
app.use("/api/v1/admin", authenticateUser, authorizeRoles("admin"), (req, res) => {
    res.send("Welcome, Admin!");
});

app.use("/api/v1/bookings", bookingRouter);

app.use("/api/v1", eventRouter);
app.use("/api/v1/events", eventRouter);
//app.use("/api/v1", authRouter);  // commented out the authRouter, try before uncommenting
//app.use(authenticationMiddleware);
//app.use("/api/v1/users", userRouter);

const db_name = process.env.DB_NAME;

//const db_url = `${process.env.DB_URL}/${db_name}`;
const db_url = "mongodb://localhost:27017/Schema";
mongoose
  .connect(db_url)
  .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));

//added for error handilng 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
