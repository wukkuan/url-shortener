const express = require("express");
const bodyParser = require("body-parser");

const { shortUrlKeyLength } = require("./env");
const {
  createShortenedUrl,
  getLongUrlFromKey
} = require("./lib/shortened-urls");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/short_link", (req, res) => {
  res.json({
    long_url: req.body.long_url,
    short_url: createShortenedUrl(req.body.long_url)
  });
});

app.get(
  new RegExp(`^\/[A-Za-z0-9]{${Number(shortUrlKeyLength)}}$`),
  (req, res) => {
    // Remove the `/` from the beginning of the path
    const shortUrlKey = req.path.substr(1);

    res.redirect(301, getLongUrlFromKey(shortUrlKey));
  }
);

module.exports = app;
