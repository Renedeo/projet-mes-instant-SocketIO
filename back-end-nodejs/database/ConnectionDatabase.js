const { MongoClient } = require("mongodb");
const uri = require("./uri");

const client = new MongoClient(uri);

module.exports = client;
