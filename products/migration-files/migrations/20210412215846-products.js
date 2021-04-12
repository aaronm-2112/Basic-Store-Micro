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
            "imgURI",
            "quantity",
            "user",
          ],
          properties: {
            name: {
              bsonType: "string",
              required: true,
            },
            price: {
              bsonType: "double",
              required: true,
            },
            descritpion: {
              bsonType: "string",
              required: true,
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
  },
};
