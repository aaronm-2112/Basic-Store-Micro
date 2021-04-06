import { Pool } from "../pool";
import User from "../model/user-model";
import bcrypt from "bcrypt";

class AuthRepo {
  async find(email: string): Promise<User | undefined> {
    // write and execute the find query using the Pool interface
    const result = await Pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (!result) {
      // this only occurs when a pool hasn't been setup
      throw new Error("Database pool not setup.");
    }

    const rows = result.rows;

    // check if any user was returned
    if (!rows.length) {
      // if no user was found return undefined
      return undefined;
    }

    // place all of the result properties into a user object
    const user: User = {
      id: rows[0].id,
      username: rows[0].username as string,
      password: rows[0].password,
      email: rows[0].email,
    };

    // return the user
    return user;
  }

  async create(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    try {
      // check if the password can be hashed
      if (password.length < 1) {
        throw new Error();
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 1); // TODO: Make a better salt process

      // write the user creation statement and execute it
      const result = await Pool.query(
        `INSERT INTO users (username, email, password) 
         VALUES ($1, $2, $3) RETURNING *`,
        [username, email, hashedPassword]
      );

      if (!result) {
        throw new Error("Database connection error");
      }

      const rows = result.rows;

      return {
        id: rows[0].id,
        username: rows[0].username as string,
        password: rows[0].password,
        email: rows[0].email,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}

const authRepo = new AuthRepo();

export { authRepo as AuthRepo };
