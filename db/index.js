const mongoose = require("mongoose");
const uri =
  "mongodb+srv://marianaospinahenao0908:3IuAcxoCNPIXgTLb@namatchdb.yoflwkv.mongodb.net/NAMatchDB?retryWrites=true&w=majority&appName=NAMatchDB";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado correctamente");
  } catch (err) {
    console.error("Error de conexión:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
