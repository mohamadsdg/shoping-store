const getDb = require("../util/database").getDb;

class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then(resualt => {})
      .catch(error => {
        console.log("catch", error);
        throw error;
      });
  }
}

module.exports = Product;
