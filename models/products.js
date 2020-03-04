// #mongoose
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const product = new schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Product", product);

// #mongo
// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = new mongodb.ObjectId(userId);
//   }
//   save() {
//     const db = getDb();
//     let dbOp = undefined;
//     if (this._id) {
//       // update
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // add
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then(resualt => {
//         return resualt;
//       })
//       .catch(error => {
//         console.log("catch", error);
//         throw error;
//       });
//   }
//   static findAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray() //.next()
//       .then(resualt => {
//         // console.log(resualt);
//         return resualt;
//       })
//       .catch(error => {
//         console.log("catch", error);
//         throw error;
//       });
//   }
//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then(resualt => {
//         // console.log(resualt);
//         return resualt;
//       })
//       .catch(error => {
//         console.log("catch", error);
//         throw error;
//       });
//   }
//   static destroy(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(id) })
//       .then(resualt => {
//         // console.log("destroy", resualt);
//       })
//       .catch(error => {
//         console.log("catch", error);
//         throw error;
//       });
//   }
// }

// module.exports = Product;
