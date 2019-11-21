const fs = require("fs");
const path = require("path");

const outputPath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
const getDataFromFile = cb => {
  fs.readFile(outputPath, (err, fileContent) => {
    err ? cb(null) : cb(JSON.parse(fileContent));
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    getDataFromFile(prevData => {
      let cart = { products: [], totalPrice: 0 };

      // Fetch the previous cart
      prevData && (cart = prevData);

      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(x => x.id === id);
      const existingProduct = cart.products[existingProductIndex];

      // Add new product/ increase quantity
      if (existingProduct) {
        cart.products[existingProductIndex] = {
          ...existingProduct,
          qty: existingProduct.qty + 1
        };
      } else {
        cart.products = [...cart.products, { id, qty: 1 }];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(outputPath, JSON.stringify(cart), err => {
        console.log(
          "method addProduct from Model Cart , callback writeFile",
          err
        );
      });
    });
  }
  static deleteProduct(id, productPrice) {
    getDataFromFile(fileContent => {
      let updatedCart = { ...fileContent };
      let product = fileContent.products.find(x => x.id === id);
      let productQty = product.qty;
      updatedCart.products = fileContent.products.filter(x => x.id !== id);
      updatedCart.totalPrice =
        updatedCart.totalPrice - productQty * productPrice;

      fs.writeFile(outputPath, JSON.stringify(updatedCart), err => {
        console.log(
          "method deleteProduct from Model Cart , callback writeFile",
          err
        );
      });
    });
  }
};
