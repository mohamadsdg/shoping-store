const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://mohamad:OG2od0fkphz2FnNS@cluster0-2v2dn.mongodb.net/test?retryWrites=true&w=majority"
  )
    .then(resualt => {
      console.log("Connected...!");
      callback(resualt);
    })
    .catch(err => console.log(err));
};
module.exports = mongoConnect;
