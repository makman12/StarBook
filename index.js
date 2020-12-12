const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://mali12:19972005@arttimetravel.vvghh.mongodb.net/StarBook?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

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
