// #mongoose
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    cart: {
      items: [
        {
          productId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Product"
          },
          quantity: { required: true, type: Number }
        }
      ]
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.methods.addToCart = function(product) {
  // console.log(this.cart);
  let newQty = 1;
  let updatedCartItems = [...this.cart.items];
  // console.log("updatedCartItems", updatedCartItems);
  // check exsit product in cart
  const cartProductIndex = this.cart.items.findIndex(
    cp => cp.productId.toString() === product._id.toString()
  );
  //has Product
  if (cartProductIndex != -1) {
    newQty = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQty;
  } else {
    updatedCartItems.push({
      productId: product._id, //auto convert to ObjectId types
      quantity: newQty
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// #mongo
// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// const ObjectId = mongodb.ObjectId;
// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart; //{items:[]}
//     this._id = id;
//   }
//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then(resualt => {
//         return resualt;
//       })
//       .catch(error => {
//         console.log("catch", error);
//         throw error;
//       });
//   }
//   addToCart(product) {
//     // console.log(this.cart);
//     let newQty = 1;
//     let updatedCartItems = [...this.cart.items];
//     // console.log("updatedCartItems", updatedCartItems);
//     // check exsit product in cart
//     const cartProductIndex = this.cart.items.findIndex(
//       cp => cp.product_id.toString() === product._id.toString()
//     );
//     //has Product
//     if (cartProductIndex != -1) {
//       newQty = this.cart.items[cartProductIndex].qty + 1;
//       updatedCartItems[cartProductIndex].qty = newQty;
//     } else {
//       updatedCartItems.push({
//         product_id: new ObjectId(product._id),
//         qty: newQty
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(product.userId) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//   removeFromCart(product) {
//     let updatedCartItems = this.cart.items.filter(
//       ci => ci.product_id.toString() !== product.toString()
//     );
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//       .then(result => {
//         console.log("removeFromCart", result);
//       })
//       .catch(err => {
//         console.log(err);
//         throw err;
//       });
//   }
//   getCart() {
//     const db = getDb();
//     let inRangeCart = this.cart.items.map(i => i.product_id);

//     // get product from collaction Products
//     // then mapData to nedded themplate
//     return db
//       .collection("products")
//       .find({ _id: { $in: inRangeCart } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(
//               x => x.product_id.toString() === p._id.toString()
//             ).qty
//           };
//         });
//       })
//       .catch(err => {
//         console.log(err);
//         throw err;
//       });
//   }
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             id: new ObjectId(this._id),
//             user: this.name
//           }
//         };
//         db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       })
//       .catch(err => {
//         console.log(err);
//         throw err;
//       });
//   }
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user.id": { $eq: new ObjectId(this._id) } })
//       .toArray();
//   }
//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(id) })
//       .then(resualt => {
//         // console.log(resualt);
//         return resualt;
//       })
//       .catch(error => {
//         console.log("catch", error);
//         throw error;
//       });
//   }
// }

// module.exports = User;
