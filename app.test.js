const app = require("./app");
const request = require("supertest");
const url = require("url");

const { hostname, port } = require("./env");

describe("Basic API calls", () => {
  test("Root URL 200s", async () => {
    await request(app)
      .get("/")
      .expect(200);
  });

  test("Made up URL 404s", async () => {
    await request(app)
      .get("/abcdefghijklmnopqrstuvwxyz")
      .expect(404);
  });
});

describe("URL Shortener", () => {
  test("Creating a short link", async () => {
    const exampleUrl = "http://www.example.com";
    const response = await request(app)
      .post("/short_link")
      .send({ long_url: exampleUrl })
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body.long_url).toBe(exampleUrl);

    const parsedShortUrl = url.parse(response.body.short_url);
    expect(parsedShortUrl.hostname).toBe(hostname);
    expect(Number(parsedShortUrl.port)).toEqual(port);

    await request(app)
      .get(parsedShortUrl.pathname)
      .expect(301)
      .expect("Location", exampleUrl);
  });

  test("Creating an already shortened URL will not create a duplicate", async () => {
    const exampleUrl = "http://www.example.com";
    const response = await request(app)
      .post("/short_link")
      .send({ long_url: exampleUrl })
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body.long_url).toBe(exampleUrl);

    const secondResponse = await request(app)
      .post("/short_link")
      .send({ long_url: response.body.short_url })
      .set("Accept", "application/json")
      .expect(200);

    expect(secondResponse.body.short_url).toBe(response.body.short_url);
  });
});
