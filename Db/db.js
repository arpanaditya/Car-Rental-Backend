const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);
function connectDb() {
  mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log("connection successfull");
  });
  connection.on("error", () => {
    console.log("connection failed");
  });
}

connectDb();
// module.exports = mongoose;
module.exports = connectDb;
