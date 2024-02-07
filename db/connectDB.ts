// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (process.env.ENVIRONMENT == "production") {
    try {
      //@ts-expect-error
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB in Production");
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  } else if (process.env.ENVIRONMENT == "development") {
    try {
      //@ts-expect-error

      await mongoose.connect(process.env.MONGODB_URI);
      mongoose.Promise = global.Promise;
      console.log("Connected to MongoDB in Development");
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  }
};

export default connectDB;
