const crypto = require("crypto");
const url = require("url");

const { protocol, hostname, port, shortUrlKeyLength } = require("../env");

// TODO: Inject this to avoid a global
const db = {};

const availableChars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateKey(availableChars, shortUrlKeyLength) {
  const keys = Array.from(crypto.randomBytes(shortUrlKeyLength));
  return keys
    .map(
      key => availableChars[Math.floor((key / 256) * availableChars.length, 10)]
    )
    .join("");
}

function generateUniqueKey(availableChars, shortUrlKeyLength) {
  let key;
  do {
    key = generateKey(availableChars, shortUrlKeyLength);
  } while (db[key]);
  return key;
}

function getLongUrlFromKey(key) {
  return db[key];
}

module.exports = {
  createShortenedUrl(longUrl) {
    const parsedLongUrl = url.parse(longUrl);
    if (
      parsedLongUrl.protocol === protocol + ":" &&
      parsedLongUrl.hostname === hostname &&
      parseInt(parsedLongUrl.port, 10) === port &&
      getLongUrlFromKey(parsedLongUrl.pathname.substr(1))
    ) {
      return longUrl;
    }

    const shortUrlKey = generateUniqueKey(availableChars, shortUrlKeyLength);
    db[shortUrlKey] = longUrl;

    const portStr = port ? `:${port}` : "";
    return `${protocol}://${hostname}${portStr}/${shortUrlKey}`;
  },

  getLongUrlFromKey
};
