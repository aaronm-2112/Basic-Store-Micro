import request from "supertest";
import { app } from "../../app";
import Context from "../../test/context";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

// TODO: Cleanup decode cookie function
interface sessionJWT {
  username: string;
  email: string;
  iat: number;
}
async function decodeCookie(response: request.Response): Promise<sessionJWT> {
  // console.log(response.headers);
  // console.log(response.headers["set-cookie"][0]); // TOOO: Make dynamic
  // extract the cookie from the set cookie header
  let cookieEndIndex = 0;

  for (let i = 0; i < response.headers["set-cookie"][0].length; i++) {
    if (response.headers["set-cookie"][0][i] === ";") {
      break;
    }
    cookieEndIndex++;
  }

  let base64cookie = response.headers["set-cookie"][0].substring(
    13, //TODO: Make more dynamic by searching for an equal sign that marks the start of the cookie's base64 encoded value
    cookieEndIndex
  );

  // decode the cookie b/c it is set in base 64
  let buff = Buffer.from(base64cookie, "base64");
  let JSONCookie = buff.toString("ascii");
  //console.log(JSONCookie);

  // parse the JSON value of the JSON stringified and still as of yet encrypted cookie
  let parsedCoookie = JSON.parse(JSONCookie);
  //console.log(parsedCoookie);

  // decrypt the jwt portion of the cookie using the secret used to encode it
  let token = (await jwt.verify(parsedCoookie.jwt, "test-secret")) as {
    username: string;
    email: string;
    iat: number;
  };
  //console.log(token);

  return token;
}

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
