import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { cacheOGInfo } from "./utils.mjs";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  const url = req.query.url;
  const info = await cacheOGInfo(url);
  console.log(`[GET] ${url}`);
  res.send(info.OGInfo);
});

// ? This functions connects to MongoDB and then starts listening as a server
async function startServer() {
  mongoose.connect(
    process.env.MONGO_DATABASE_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Connected to DataBase");
      app.listen(PORT, () => {
        console.log(`Listening on Port 3000 ...`);
      });
    }
  );
}

startServer();
