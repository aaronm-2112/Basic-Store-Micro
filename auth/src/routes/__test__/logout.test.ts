import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../app";
import Context from "../../test/context";
import { AuthRepo } from "../../repos/auth-repo";
import { decodeCookie } from "../../services/decode-cookie";

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

it("Clears the current session", async () => {
  // create a user
  await AuthRepo.create(username, email, password);

  // login with the user
  const response = await request(app)
    .post("/api/auth/signin")
    .send({
      email,
      password,
    })
    .expect(200);

  // pass the cookie into the logout route
  const logoutResponse = await request(app)
    .post("/api/auth/logout")
    .set("Cookie", response.get("Set-Cookie"))
    .send();

  // check that the session cookie has the JWT property set as undefiend
  const jwt = await decodeCookie(logoutResponse);
  expect(jwt).toBe(null);
});
