const fs = require("fs");
const path = require("path");

const outputPath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getDataFromFile = cb => {
  fs.readFile(outputPath, (err, fileContent) => {
    err ? cb([]) : cb(JSON.parse(fileContent));
  });
};

class Product {
  constructor(title, imageUrl, price, description) {
    this.id = Math.random().toString();
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  save() {
    getDataFromFile(fileContent => {
      fileContent.push(this);
      fs.writeFile(outputPath, JSON.stringify(fileContent), err => {
        console.log("method Save Product , callback writeFile", err);
      });
    });
  }

  static fetchAll(cb) {
    getDataFromFile(cb);
  }

  static findByIndex(id, cb) {
    getDataFromFile(content => {
      let rsp = content.find(x => x.id === id);
      rsp ? cb(false, rsp) : cb(true, rsp);
    });
  }
}

module.exports = Product;
