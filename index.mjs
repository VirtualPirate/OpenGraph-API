import express from "express";
import cors from "cors";

import { cacheOGInfo } from "./utils.mjs";

import fs from "fs";

fs.chmod("public/ogData", 0o777, (err) => {
  if (err) throw err;
  console.log("Folder permissions changed.");
});

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

app.listen(PORT, () => {
  console.log(`Listening on Port 3000 ...`);
});
