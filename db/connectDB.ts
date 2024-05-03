// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (process.env.ENVIRONMENT == "production") {
    try {
      await mongoose.connect(process.env.MONGODB_PROD_URI as string);
      console.log("Connected to MongoDB in Production");
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  } else if (process.env.ENVIRONMENT == "development") {
    try {
      //
      await mongoose.connect(process.env.MONGODB_DEV_URI as string);
      mongoose.Promise = global.Promise;
      console.log("Connected to MongoDB in Development");
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  }
};

export default connectDB;
