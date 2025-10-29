import express from "express";
import cors from "cors";

async function main() {
  const hostname = "localhost";
  const port = 3000;

  const app = express();

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
