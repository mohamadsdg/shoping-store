const getDb = require("../util/database").getDb;

class Product {
  constructor(title, imageUrl, price, description) {
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
  static findAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray() //.next()
      .then(resualt => {
        console.log(resualt);
        return resualt;
      })
      .catch(error => {
        console.log("catch", error);
        throw error;
      });
  }
}

module.exports = Product;
