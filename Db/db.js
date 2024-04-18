const mongoose = require("mongoose");

function connectDb() {
  mongoose.connect("mongodb+srv://arpanaditya:arpanaditya@cluster0.1fjvmrp.mongodb.net/mern_admin?retryWrites=true&w=majority&appName=Cluster0", {
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
