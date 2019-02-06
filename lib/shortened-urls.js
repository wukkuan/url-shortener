const crypto = require("crypto");

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

module.exports = {
  createShortenedUrl(longUrl) {
    const shortUrlKey = generateUniqueKey(availableChars, shortUrlKeyLength);
    db[shortUrlKey] = longUrl;

    const portStr = port ? `:${port}` : "";
    return `${protocol}://${hostname}${portStr}/${shortUrlKey}`;
  },

  getLongUrlFromKey(key) {
    return db[key];
  }
};
