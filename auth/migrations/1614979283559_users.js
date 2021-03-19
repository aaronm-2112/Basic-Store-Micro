/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL UNIQUE CHECK( LENGTH (username) > 0 ), 
        password VARCHAR NOT NULL CHECK( LENGTH (password) > 0),
        email VARCHAR(50) NOT NULL UNIQUE CHECK( LENGTH (email) > 0)
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DELETE TABLE users;`);
};

// TO run migrations with the cli:
//  DATABASE_URL=postgres://USERNAME:PASSWORD_FOR_DB_ACCWESS@HOST:PORT/DATABASE  npm run migrate up
