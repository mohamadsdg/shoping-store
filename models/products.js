const fs = require("fs");
const path = require("path");

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  get outputPath() {
    return path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
  }
  save() {
    fs.readFile(this.outputPath, (err, data) => {
      let products = [];
      !err && (products = JSON.parse(data));
      products.push(this);
      fs.writeFile(this.outputPath, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, data) => {
      !err ? cb(JSON.parse(data)) : cb([]);
    });
  }
}

module.exports = Product;
