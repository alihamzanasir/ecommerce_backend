import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger-output.json" assert { type: "json" };
import { router } from "./routes/auth.js";
import { basketRouter } from "./routes/basket.js";
import cors from "cors";
import { readFileSync } from "fs";

const swaggerDocument = JSON.parse(
  readFileSync(new URL("./swagger-output.json", import.meta.url))
);

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

//swagger-ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes

app.use("/api", router);
app.use("/api", basketRouter);


app.get("/",(req,res) => {
  res.send("Hello Ali")
})
// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT, () => {
  try {
    console.log("server starting at port 4000");
  } catch (error) {
    console.log("server error");
  }
});
