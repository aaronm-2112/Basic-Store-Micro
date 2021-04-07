import request from "supertest";
import { app } from "../../app";
import Context from "../../test/context";
import { AuthRepo } from "../../repos/auth-repo";

let context: Context;
beforeAll(async () => {
  // build the pool connection for the current test process
  context = await Context.build();
});

afterAll(() => {
  return context.close();
});

beforeEach(async () => {
  await context.reset();
});

// usefule constants for testing user signin
const username = "test",
  password = "1234",
  email = "test@test.com";

it("Should receive the correct user information if logged in", async () => {
  // create the user
  await AuthRepo.create(username, email, password);

  // login with the user
  const response = await request(app)
    .post("/api/auth/signin")
    .send({
      email,
      password,
    })
    .expect(200);

  // grab the cookie from the response
  const cookie = response.get("Set-Cookie");

  // fetch the current user information from the encrypted JWT stored in the cookie session for that user
  const userInfoResponse = await request(app)
    .get("/api/auth/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  // ensure that the response has the correct email and username
  expect(userInfoResponse.body.email).toBe(email);
  expect(userInfoResponse.body.username).toBe(username);
});

it("Should respond with a 401 if a user is not logged in", async () => {
  await request(app).get("/api/auth/currentuser").send().expect(401);
});
