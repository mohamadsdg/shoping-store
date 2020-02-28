const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db = undefined;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://mohamad:OG2od0fkphz2FnNS@cluster0-2v2dn.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then(resualt => {
      console.log("Connected...!");
      _db = resualt.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "no DataBase found !";
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
