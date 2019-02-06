const app = require("./app");
const request = require("supertest");

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
