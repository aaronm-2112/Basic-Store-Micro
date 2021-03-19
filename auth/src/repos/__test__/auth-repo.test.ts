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

// useful constants for testing
const username = "test",
  password = "1234",
  email = "test@test.com";

it("successfully creates and finds a user", async () => {
  const user = await AuthRepo.create(username, email, password);

  expect(user!.email).toBe(email);
  expect(user!.username).toBe(username);

  const newUser = await AuthRepo.find(email);

  expect(newUser!.email).toBe(email);
  expect(newUser!.username).toBe(username);
});

it("throws an error when not given a valid username", async (done) => {
  try {
    await AuthRepo.create("", email, password);
  } catch (e) {
    done();
  }
});

it("throws an error when not given a valid email", async (done) => {
  try {
    await AuthRepo.create(username, "", password);
  } catch (e) {
    done();
  }
});

it("throws an error when not given a valid password", async (done) => {
  try {
    await AuthRepo.create(username, email, "");
  } catch (e) {
    done();
  }
});

it("returns undefined when finding a user that does not exist", async () => {
  let user = await AuthRepo.find("notauser@test.com");
  expect(user).toBe(undefined);
});
