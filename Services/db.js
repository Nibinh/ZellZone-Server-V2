const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

mongoose.connect(url);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.log(`MongoDb coonection error${err}`);
});

db.on("disconnected", () => {
  console.log("MongoDb disconnected");
});

process.on("SIGINT", () => {
  db.close(() => {
    console.log("MongoDb connection close through app termination");
    process.exit(0);
  });
});

module.exports = mongoose;
