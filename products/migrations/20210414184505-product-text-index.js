module.exports = {
  async up(db, client) {
    // create a compound text based index to support basic full text search on a product name and category
    await db
      .collection("products")
      .createIndex({ name: "text", brand: "text", category: "text" });
  },

  async down(db, client) {
    // drop all non _id based indexes
    await db.collection("products").dropIndexes();
  },
};
