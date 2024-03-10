import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_CLOUD_URI as string)
      .then((data) => {
        console.log(`Database connected on ${data.connection.host}`);
      });
  } catch (error) {
    console.log("Database connection falied.");
    process.exit(1);
  }
};

export default connectDB;
