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
  static findByIndex(id) {
    return db.execute("SELECT * FROM products WHERE id=?", [id]);
  }
  static deleteByIndex(id) {
    return db.execute("DELETE FROM products WHERE id=?", [id]);
  }
  editByIndex(id) {
    return db.execute(
      "UPDATE products SET title=? , imageUrl=? , price=? , description=? WHERE id=?",
      [this.title, this.imageUrl, this.price, this.description, id]
    );
  }
  save() {
    return db.execute(
      "INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }
}

module.exports = Product;
