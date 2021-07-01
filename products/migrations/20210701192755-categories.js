module.exports = {
  async up(db, client) {
    // create the categories collection
    await db.createCollection("categories", {
      // add schema validation
      validator: {
        // use the recommended schema validator
        $jsonSchema: {
          bsonType: "object",
          required: ["category"],
          properties: {
            category: {
              // every category needs to have a length of at least one
              bsonType: "string",
              minLength: 1,
            },
          },
        },
      },
    });

    // add a list of predefined categories to the database
    await db
      .collection("categories")
      .insertMany([
        { category: "footwear" },
        { category: "food" },
        { category: "outdoor" },
        { category: "music" },
        { category: "education" },
        { category: "medicine" },
        { category: "entertainment" },
        { category: "education" },
        { category: "candy" },
      ]);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection("categories").drop();
  },
};
