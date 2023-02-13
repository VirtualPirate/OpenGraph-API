import fs from "fs";
import path from "path";
import filenamify from "filenamify";
import { fileURLToPath } from "url";
import ogs from "open-graph-scraper";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OG_DATA_DIR = path.join(__dirname, "public/ogData");

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

// async function renewCache

// Checks if the cache is expired. Current day is 1
function isCacheExpired(filename) {
  const date_modified = fs.statSync(path.join(OG_DATA_DIR, filename)).mtime;
  const current_date = new Date();

  const date_difference = Math.abs(current_date - date_modified);
  const day_difference = date_difference / (1000 * 3600 * 24);
  return day_difference > 1;
}

/*
  This function returns parsed Open Graph Information from the cache.
  Or requests the website for OG data, if the cache is not present or expired
*/
export async function cacheOGInfo(url) {
  const namified_url = filenamify(url);
  const json_filename = `${namified_url}.json`;

  let OGInfo = undefined;

  //If the data exists in cache and not expired
  if (ogDataExists(json_filename) && !isCacheExpired(json_filename)) {
    OGInfo = await readOGFromJson(json_filename);
  }

  // If the cache is expired or not present
  else {
    OGInfo = await getOGInfo(url);
    saveOGInJson(json_filename, OGInfo);
  }

  return { OGInfo };
}
