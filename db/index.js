const mongoose = require("mongoose");

// Read the connection URI from the environment variable.
// When running with `docker-compose up`, this will be "mongodb://mongo:27017/mydatabase"
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  // It's good practice to check if the URI exists
  if (!uri) {
    console.error("Error: MONGO_URI environment variable not defined.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully to the Docker container");
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
