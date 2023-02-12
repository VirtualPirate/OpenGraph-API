import fs from "fs";
import path from "path";
import filenamify from "filenamify";
import axios from "axios";
import { fileURLToPath } from "url";
import ogs from "open-graph-scraper";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OG_DATA_DIR = path.join(__dirname, "public/ogData");
const OG_IMAGES_DIR = path.join(__dirname, "public/ogImages");

export function saveOGInJson(filename, OGInfo) {
  const json_data_file = path.join(OG_DATA_DIR, filename);
  fs.writeFileSync(json_data_file, JSON.stringify(OGInfo), {
    encoding: "utf8",
  });
}

export function readOGFromJson(filename) {
  const json_data_file = path.join(OG_DATA_DIR, filename);
  try {
    const data = fs.readFileSync(json_data_file, { encoding: "utf8" });
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
}

export function ogDataExists(filename) {
  const json_data_file = path.join(OG_DATA_DIR, filename);
  return fs.existsSync(json_data_file);
}

export function ogImageExists(filename) {
  const png_data_file = path.join(OG_IMAGES_DIR, filename);
  return fs.existsSync(png_data_file);
}

export async function saveOGImage(filename, url) {
  console.log("saveOGImage");
  const png_data_file = path.join(OG_IMAGES_DIR, filename);
  await download_file(url, png_data_file);
  console.log(ogImageExists(filename));
}

export async function getOGInfo(url) {
  const options = { url };

  let OGInfo = undefined;
  await ogs(options).then((data) => {
    const { error, result } = data;
    console.log(result);
    if (!error) {
      let { ogSiteName, ogTitle, ogUrl, ogDescription } = result;

      let { ogImage } = result;
      if (ogImage !== undefined) {
        ogImage = ogImage.url;
      }

      if (ogUrl === undefined) {
        ogUrl = url;
      }

      OGInfo = { ogSiteName, ogTitle, ogUrl, ogDescription, ogImage };
    }
  });

  return OGInfo;
}

export async function download_file(url, filename) {
  if (url === undefined) return;
  return new Promise((resolve, reject) => {
    const file_stream = fs.createWriteStream(filename);
    axios({
      method: "GET",
      url: url,
      responseType: "stream",
    })
      .then(function (response) {
        response.data.pipe(file_stream);
      })
      .catch(function (error) {
        console.error(error);
      });

    file_stream.on("finish", () => {
      file_stream.close();
      resolve();
    });
  });
}

// async function renewCache

// Checks if the cache is expired. Current day is 1
function isCacheExpired(filename) {
  const date_modified = fs.statSync(path.join(OG_DATA_DIR, filename)).mtime;
  const current_date = new Date();

  const date_difference = Math.abs(current_date - date_modified);
  const day_difference = date_difference / (1000 * 3600 * 24);
  console.log(day_difference);
  return day_difference > 1;
}

export async function cacheOGInfo(url) {
  const namified_url = filenamify(url);
  const json_filename = `${namified_url}.json`;
  const png_filename = json_filename.replace("json", "png");

  let OGInfo = undefined;
  if (ogDataExists(json_filename) && !isCacheExpired(json_filename)) {
    // If the json file exists for the link in the server or not expired
    OGInfo = await readOGFromJson(json_filename);
  } else {
    // If the json file doesn't exist for the link in the server
    OGInfo = await getOGInfo(url);
    saveOGInJson(json_filename, OGInfo);
  }

  if (!ogImageExists(png_filename) && OGInfo.ogImage) {
    await saveOGImage(png_filename, OGInfo.ogImage);
    console.log(ogImageExists(png_filename));
  }

  return {
    OGInfo,
    imagePath: path.join(OG_IMAGES_DIR, png_filename),
  };
}
