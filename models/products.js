const Cart = require("./cart");
const db = require("../util/database");

class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }
  static findByIndex(id) {}
  static deleteByIndex(id) {}

  save() {}
}

module.exports = Product;
