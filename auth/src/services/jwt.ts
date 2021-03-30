import jwt from "jsonwebtoken";

export const createJWT = (username: string, email: string) => {
  // TODO: Add way to slot in the test and dev and prod secret key
  const token = jwt.sign({ username, email }, "test-secret");
  return token;
};
