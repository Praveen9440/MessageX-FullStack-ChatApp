import mongoose from "mongoose";
import { config } from "dotenv";
config();

export const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);

    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
