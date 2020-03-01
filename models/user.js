const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
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
