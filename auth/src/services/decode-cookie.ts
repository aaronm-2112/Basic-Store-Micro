import request from "supertest";
import jwt from "jsonwebtoken";

export async function decodeCookie(
  response: request.Response
): Promise<sessionJWT | null> {
  // console.log(response.headers);
  // console.log(response.headers["set-cookie"][0]); // TOOO: Make dynamic

  // extract the session cookie out of the set cookie header
  let base64Cookie = response.get("Set-Cookie").find((cookie) => {
    console.log(cookie);
    return cookie.includes("express:sess=") === true;
  });
  //console.log(base64Cookie);

  // get the index of the ; that marks the end of the cookie value
  let cookieEndIndex = 0;
  cookieEndIndex = base64Cookie!.indexOf(";");

  // extract the index of the = that marks the beggining of the cookie value
  let cookieValueStartIndex = base64Cookie!.indexOf("=") + 1;

  // extract the cookie value using the start and end index
  let base64CookieValue = base64Cookie!.substring(
    cookieValueStartIndex, // where the cookie value starts
    cookieEndIndex
  );

  // Check if the length of the cookie value is less than one.
  // If so then the cookie was cleared by the user (generally by logging out).
  // Return null to indicate to the logout tests that the cookie was successfully cleared
  if (base64CookieValue.length < 1) {
    return null;
  }

  // decode the cookie b/c it is set in base 64
  let buff = Buffer.from(base64CookieValue, "base64");
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

// TODO: Cleanup decode cookie function
interface sessionJWT {
  username: string;
  email: string;
  iat: number;
}
