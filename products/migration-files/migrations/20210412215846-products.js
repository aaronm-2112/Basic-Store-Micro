module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    // create the products collection
    await db.createCollection("products", {
      // add schema validation
      validator: {
        // use the recommended schema validator
        $jsonSchema: {
          bsonType: "object",
          required: [
            "name",
            "price",
            "description",
            "category",
            "imageURI",
            "quantity",
            "user",
          ],
          properties: {
            name: {
              // every product needs to be named
              bsonType: "string",
            },
            price: {
              bsonType: "double",
            },
            description: {
              // every product requires a description
              bsonType: "string",
            },
            category: {
              // each product can belong to many categories
              bsonType: "array",
            },
            imageURI: {
              bsonType: "string",
            },
            quantity: {
              // used to keep track of how many products are still in stock
              bsonType: "int",
            },
            user: {
              // embed the user document because this information is logically grouped when pulling product info
              bsonType: "object",
              required: ["username", "email"],
              properties: {
                username: {
                  bsonType: "string",
                },
                email: {
                  bsonType: "string",
                },
              },
            },
          },
        },
      },
    });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection("products").drop();
  },
};
