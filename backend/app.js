const express = require("express");
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const cors = require("cors");

const app = express();


const eventRouter = require("./Routes/event");
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


/*// Example admin route with role-based access control
app.use("/api/v1/admin", authenticateUser, authorizeRoles("admin"), (req, res) => {
    res.send("Welcome, Admin!");
});
*/
app.use("/api/v1/events", eventRouter); // Public route, no authenticateUser middleware here
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouter);

app.use("/api/v1/booking", authenticateUser, bookingRouter);  // Example protected route
app.use("/api/v1/users", authenticateUser, userRouter); // Protected users rout
app.use("/api/v1", bookingRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", eventRouter);

// app.use("/api/v1/users", userRouter);
// app.use("/api/v1", userRouter);

// app.use("/api/v1/bookings", bookingRouter);
// app.use("/api/v1", bookingRouter);

// app.use("/api/v1", eventRouter);
// app.use("/api/v1/events", eventRouter);


//app.use("/api/v1", authRouter);  // commented out the authRouter, try before uncommenting
//app.use(authenticationMiddleware);
//app.use("/api/v1/users", userRouter);

mongoose.connect(process.env.DB_URL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log("MongoDB Atlas connected successfully"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  
  // Try fallback to local MongoDB
  console.log("Attempting to connect to local MongoDB...");
  mongoose.connect("mongodb://localhost:27017/")
    .then(() => console.log("Connected to local MongoDB"))
    .catch((localErr) => {
      console.error("Local MongoDB connection failed:", localErr);
      process.exit(1);
    });
});

// //const db_url = `${process.env.DB_URL}/${db_name}`;
// const db_url = "mongodb://localhost:27017/Schema";
// mongoose
//   .connect(db_url)
//   .then(() => console.log("mongoDB connected"))
//   .catch((e) => {
//     console.log(e);
//   });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));

//added for error handilng 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
