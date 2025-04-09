const express = require("express");
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const cors = require("cors");

const app = express();

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
