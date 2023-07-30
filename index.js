const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const MONGO_URL = process.env.MONGO_URL;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


//1UoMObZocYbWivOp
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    console.log("connected to the database")
  ).catch((err) => console.log(err));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});


 app.listen(PORT, () => {
   console.log("connected to the server");
 });

