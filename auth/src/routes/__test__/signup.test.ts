import request from "supertest";
import { app } from "../../app";
import Context from "../../test/context";
import bcrypt from "bcrypt";
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

// usefule constants for testing user signup
const username = "test",
  password = "1234",
  email = "test@test.com";

it("Returns a 201 on successful signup", async () => {
  // send the faked HTTP request to create a user
  let response = await request(app)
    .post("/api/auth/signup")
    .send({
      username,
      password,
      email,
    })
    .expect(201);

  // ensure the response fields match the given request fields
  expect(response.body.username).toEqual(username);
  expect(response.body.email).toEqual(email);
  const match = await bcrypt.compare(password, response.body.password);
  expect(match).toEqual(true);
  expect(match).toEqual(true);
});

it("Returns a 201 on successful signup and creates a cookie session successfully", async () => {
  // send the faked HTTP request to create a user
  let response = await request(app)
    .post("/api/auth/signup")
    .send({
      username,
      password,
      email,
    })
    .expect(201);

  // ensure the response fields match the given request fields
  expect(response.body.username).toEqual(username);
  expect(response.body.email).toEqual(email);
  const match = await bcrypt.compare(password, response.body.password);
  expect(match).toEqual(true);

  // get the jwt out of the cookie set in the response headers
  const token = await decodeCookie(response);

  // check the contents of the jwt to ensure they were set correctly
  expect(token["username"]).toBe("test");
  expect(token["email"]).toBe("test@test.com");
});

it("Returns a 400 without a password being provided to the route", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({ username, email })
    .expect(400);
});

it("Returns a 400 when an invalid password is provided to the route", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      username: "aaronm",
      email: "test@test.com",
      password: "1111111111111111111111111111111", // Give a password that is longer than 30 characters
    })
    .expect(400);
});

it("Returns a 400 when the request is missing an email", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      username,
      password,
    })
    .expect(400);
});

it("Returns a 400 when the request has an invalid email", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      username,
      password,
      email: "et.com",
    })
    .expect(400);
});
