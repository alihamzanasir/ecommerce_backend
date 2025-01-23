import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Node Js Express Js MongoDb",
    description: "Api Docs",
  },
  host: "localhost:4000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/auth.js", "./routes/basket.js"];

swaggerAutogen(outputFile, routes, doc);
