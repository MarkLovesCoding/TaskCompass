// db.js
import mongoose from "mongoose";

const connectDB = async () => {
  console.log("start connectDB");
  if (process.env.ENVIRONMENT == "production") {
    console.log("start connectDB in prod");

    try {
      //@ts-expect-error
      await mongoose.connect(process.env.MONGODB_PROD_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB in Production");
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  } else if (process.env.ENVIRONMENT == "development") {
    console.log("start connectDB in dev");
    try {
      //@ts-expect-error

      await mongoose.connect(process.env.MONGODB_DEV_URI);
      mongoose.Promise = global.Promise;
      console.log("Connected to MongoDB in Development");
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  }
};

export default connectDB;
