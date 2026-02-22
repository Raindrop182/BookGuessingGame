import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoConnectionSRV = process.env.MONGO_URI!;

export function connectDB() {
  mongoose
    .connect(mongoConnectionSRV)
    .then(() => console.log("Connected."))
    .catch((error) => console.log(error));
}
