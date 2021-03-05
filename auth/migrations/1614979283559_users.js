/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL UNIQUE, 
        password VARCHAR(30) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`DELETE TABLE users;`);
};

// TO run migrations with the cli:
//  DATABASE_URL=postgres://USERNAME:PASSWORD_FOR_DB_ACCWESS@HOST:PORT/DATABASE  npm run migrate up
