import { Pool } from "../pool";
import User from "../model/user-model";

class AuthRepo {
  async find(email: string): Promise<User | undefined> {
    try {
      // write and execute the find query using the Pool interface
      const result = await Pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);

      if (!result) {
        throw new Error("Database error");
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
    } catch (e) {
      throw new Error(e);
    }
  }
}

const authRepo = new AuthRepo();

export { authRepo as AuthRepo };
