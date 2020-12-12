const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");
mongoose.connect(process.env.DB, { useNewUrlParser: true });

const starSchema = new mongoose.Schema({
  name: String,
});

const Star = mongoose.model("Stars", starSchema);

const silence = new Star({ name: "Silence" });

app.use(express.static("static"));

app.get("/data", (req, res, next) => {
  Star.find({}, function (err, stars) {
    res.send(stars);
  });
});

app.listen(port);
