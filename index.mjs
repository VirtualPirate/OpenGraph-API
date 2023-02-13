import express from "express";
import cors from "cors";

import { cacheOGInfo } from "./utils.mjs";

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
  res.send(info.OGInfo);
});

app.listen(PORT, () => {
  console.log(`Listening on Port 3000 ...`);
});
