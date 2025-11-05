import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"; //
import crypto from "crypto";
import { Mongo } from "../database/mongodb.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const collectionName = "users";

export function setupAuthRoutes(app) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, callback) => {
        try {
          const user = await Mongo.db
            .collection(collectionName)
            .findOne({ email: email });

          if (!user) {
            return callback(null, false);
          }

          const saltBuffer = user.salt;

          crypto.pbkdf2(
            password,
            saltBuffer,
            310000,
            16,
            "sha256",
            (err, hashedPassword) => {
              if (err) {
                return callback(err);
              }

              const userPasswordBuffer = Buffer.from(user.password);

              if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
                return callback(null, false);
              }
              const { password, salt, ...rest } = user;

              return callback(null, rest);
            }
          );
        } catch (error) {
          return callback(error);
        }
      }
    )
  );

  const authRouter = express.Router();

  authRouter.post("/signup", async (req, res) => {
    try {
      const checkUser = await Mongo.db
        .collection(collectionName)
        .findOne({ email: req.body.email });

      if (checkUser) {
        return res.status(409).send({
          sucess: false,
          statusCode: 409,
          body: {
            text: "User already exists",
          },
        });
      }

      res.status(201).send({
        sucess: true,
        text: "Usuário pronto para ser criado (lógica de criação pendente)",
      });
    } catch (error) {
      console.error("Erro no /signup:", error);
      res
        .status(500)
        .send({ text: "Erro interno no servidor", error: error.message });
    }
  });

  return authRouter;
}
