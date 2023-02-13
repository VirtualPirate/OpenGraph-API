import express from "express";
import cors from "cors";

import { cacheOGInfo } from "./utils.mjs";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  const url = req.query.url;
  const info = await cacheOGInfo(url);
  res.send(info.OGInfo);
});

app.listen(3000, () => {
  console.log(`Listening on Port 3000 ...`);
});
