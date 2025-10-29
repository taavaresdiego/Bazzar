import express from "express";
import cors from "cors";
import { Mongo } from "./database/mongodb.js";
import { config } from "dotenv";

config();

async function main() {
  const hostname = "localhost";
  const port = 3000;

  const app = express();

  const mongoConnection = await Mongo.connect({
    mongoConnectionString: process.env.MONGO_CS,
    mongoDbName: process.env.MONGO_DB_NAME,
  });
  console.log(mongoConnection);
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send({
      sucess: true,
      statusCode: 200,
      body: "Bem-vindo ao Supermercado",
    });
  });

  app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

main();
