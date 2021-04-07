import request from "supertest";
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

it("Should return a 200 on successful sign in", async () => {
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
});

it("Should create a session for the user on successful sign in", async () => {
  // create the user
  await AuthRepo.create(username, email, password);

  const response = await request(app)
    .post("/api/auth/signin")
    .send({
      email,
      password,
    })
    .expect(200);

  // get the jwt out of the cookie set in the response headers
  const token = await decodeCookie(response);

  // check the contents of the jwt to ensure they were set correctly
  expect(token["username"]).toBe("test");
  expect(token["email"]).toBe("test@test.com");
});

it("Should return a 400 when given invalid credentials", async () => {
  await request(app)
    .post("/api/auth/signin")
    .send({
      email: "",
      password,
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signin")
    .send({
      email,
      password: "",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signin")
    .send({
      email: "tttttttttttttttttttttttttttttttt",
      password,
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signin")
    .send({
      password,
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signin")
    .send({
      email,
    })
    .expect(400);
});
