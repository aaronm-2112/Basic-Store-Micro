import request from "supertest";
import jwt from "jsonwebtoken";
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

// TODO: Cleanup decode cookie function
interface sessionJWT {
  username: string;
  email: string;
  iat: number;
}
async function decodeCookie(
  response: request.Response
): Promise<sessionJWT | null> {
  // console.log(response.headers);
  console.log(response.headers["set-cookie"][0]); // TOOO: Make dynamic
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

  // check if the cookie's value is null -- this happens when we
  if (!JSONCookie) {
    return null;
  }

  // parse the JSON value of the JSON stringified and still as of yet encrypted cookie
  let parsedCoookie = JSON.parse(JSONCookie);
  //console.log(parsedCoookie);

  // decrypt the jwt portion of the cookie using the secret used to encode it
  let token = jwt.verify(parsedCoookie.jwt, "test-secret") as {
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
