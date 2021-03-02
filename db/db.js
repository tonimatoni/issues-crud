//Import the mongoose module
var mongoose = require("mongoose");
var dotenv = require("dotenv");

module.exports = function connectToDB() {
  //Set up default mongoose connection
  dotenv.config({ path: process.cwd() + "/config.env" });
  var mongoDB = process.env.DB_CONNECTION;
  console.log(mongoDB);
  mongoose.connect(
    mongoDB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Connected to DB!");
    }
  );

  //Get the default connection
  var db = mongoose.connection;
  //Bind connection to error event (to get notification of connection errors)
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
};
