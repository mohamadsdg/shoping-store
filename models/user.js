const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;
class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; //{items:[]}
    this._id = id;
  }
  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then(resualt => {
        return resualt;
      })
      .catch(error => {
        console.log("catch", error);
        throw error;
      });
  }
  addToCart(product) {
    // console.log(this.cart);
    let newQty = 1;
    let updatedCartItems = [...this.cart.items];
    // console.log("updatedCartItems", updatedCartItems);
    // check exsit product in cart
    const cartProductIndex = this.cart.items.findIndex(
      cp => cp.product_id.toString() === product._id.toString()
    );
    //has Product
    if (cartProductIndex != -1) {
      newQty = this.cart.items[cartProductIndex].qty + 1;
      updatedCartItems[cartProductIndex].qty = newQty;
    } else {
      updatedCartItems.push({
        product_id: new ObjectId(product._id),
        qty: newQty
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(product.userId) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(id) })
      .then(resualt => {
        // console.log(resualt);
        return resualt;
      })
      .catch(error => {
        console.log("catch", error);
        throw error;
      });
  }
}

module.exports = User;
