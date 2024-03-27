import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

const getConnection = () => {
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.log("Failed to connect DB -", err.message);
    });
};
export default getConnection;
