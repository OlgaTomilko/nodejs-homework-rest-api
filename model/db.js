// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

const uriDb = process.env.URI_DB;

// const db = MongoClient.connect(uriDb, {
const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

process.on("SIGINT", async () => {
  // const client = await db;
  // client.close();
  mongoose.connection.close(() => {
    console.log("Disconnect MongoDB");
    process.exit();
  });
});

module.exports = db;
