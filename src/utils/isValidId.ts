import mongoose from "mongoose";

const isValidId = (id: string) => {
  try {
    return mongoose.Types.ObjectId.isValid(id);
  } catch (error) {
    console.log("Invalid Id");
  }
};

export default isValidId;
