import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 9291;
import router from "./routes.js";
import getConnection from "./src/helper/databaseConnection.js";
import cors from "cors";

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
getConnection()
router(app);

app.listen(PORT, () => {
  console.log("Server runninng on port", PORT);
});
