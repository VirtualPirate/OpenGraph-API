import filenamify from "filenamify";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import { ogImageExists, cacheOGInfo } from "./utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OG_DATA_DIR = path.join(__dirname, "public/ogData");
const OG_IMAGES_DIR = path.join(__dirname, "public/ogImages");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/static", express.static(path.join(__dirname, "public/ogImages/")));

app.get("/", async (req, res) => {
  const url = req.query.url;
  const info = await cacheOGInfo(url);
  res.send(info.OGInfo);
});

app.get("/ogImage", async (req, res) => {
  const url = req.query.url;
  const namified_url = filenamify(url);
  const png_filename = `${namified_url}.png`;
  const png_data_file = path.join(OG_IMAGES_DIR, png_filename);

  if (!ogImageExists(png_filename)) await cacheOGInfo(url);

  if (!ogImageExists(png_filename)) {
    res.sendStatus(404);
  } else {
    res.sendFile(png_data_file, (err) => console.log(err));
  }
});

app.listen(3000, () => {
  console.log(`Listening on Port 3000 ...`);
});

// await download_file(
//   "https://assets.vercel.com/image/upload/v1662090959/front/nextjs/twitter-card.png",
//   "twitter.png"
// );

// const data = fs.readFileSync("twitter.png");
// console.log(data);
