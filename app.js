const express = require("express");
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const cors = require("cors");

const app = express();

const userRouter = require("./Routes/user");
const authRouter = require("./Routes/auth");
const authenticationMiddleware=require('C:\Users\My Lap\Documents\sem 4\Software Engneering\SE-Project\Middleware\authenticationMiddleware.js')



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

app.use("/api/v1", authRouter);
app.use(authenticationMiddleware);
app.use("/api/v1/users", userRouter);

const db_name = process.env.DB_NAME;

const db_url = `${process.env.DB_URL}/${db_name}`;

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
