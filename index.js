import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger-output.json" assert { type: "json" };
import { router } from "./routes/auth.js";
import { basketRouter } from "./routes/basket.js";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 


const swaggerDocument = JSON.parse(
  readFileSync(new URL("./swagger-output.json", import.meta.url))
);

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
//swagger-ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes

app.use("/api", router);
app.use("/api", basketRouter);


app.get("/",(req,res) => {
  res.send("Hello world")
})
// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// app.use("/uploads", express.static("uploads"));
app.use(express.static('uploads'));
app.use("/uploads", express.static(join(__dirname, 'uploads')));

app.listen(process.env.PORT, () => {
  try {
    console.log(`server starting at port ${process.env.PORT}`);
  } catch (error) {
    console.log("server error");
  }
});
