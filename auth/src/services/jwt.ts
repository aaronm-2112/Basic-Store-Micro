import jwt from "jsonwebtoken";

export const createJWT = (username: string, email: string) => {
  const token = jwt.sign({ username, email }, "test-secret");
  return token;
};
