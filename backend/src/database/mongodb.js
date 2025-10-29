import { text } from "express";
import { MongoClient, mongoClient } from "mongodb";

export const Mongo = {
  async connect({ mongoConnectionString, mongoDbName }) {
    try {
      const client = new MongoClient(mongoConnectionString);
      await client.connect();
      const db = client.db(mongoDbName);
      this.client = client;
      this.db = db;

      return { text: "Conectado ao banco de dados" };
    } catch (error) {
      return { text: "Error ao conectar ao banco de dados", error };
    }
  },
};
