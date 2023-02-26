import ogs from "open-graph-scraper";
import OGDatas from "./ogdata.schema.mjs";

// Fetches the Open Graph data using the open=graph-scraper
export async function getOGInfo(url) {
  const options = { url };

  let OGInfo = undefined;
  await ogs(options).then((data) => {
    const { error, result } = data;
    // console.log(result);
    if (!error) {
      let ogUrl;
      let { ogSiteName, ogTitle, ogDescription } = result;

      let { ogImage } = result;
      if (ogImage !== undefined) {
        ogImage = ogImage.url;
      }

      ogUrl = url;

      OGInfo = { ogSiteName, ogTitle, ogUrl, ogDescription, ogImage };
    }
  });

  return OGInfo;
}

// Checks if the databse data is expired. Current day is 1
function isOGDataExpired(OGdata) {
  const dateCreated = OGdata.dateCreated;
  const date_difference = Math.abs(Date.now() - dateCreated);

  const day_difference = date_difference / (1000 * 3600 * 24);
  return day_difference > 1;
}

/*
  This function returns parsed Open Graph Information from the database.
  Or requests the website for OG data, if the database data is not present or expired
*/
export async function cacheOGInfo(url) {
  let OGInfo = undefined;
  const OGData = await OGDatas.findOne({ url: url });
  // console.log("OGData", OGData);

  //If the data exists in database and not expired
  if (OGData && !isOGDataExpired(OGData)) {
    OGInfo = {
      ogSiteName: OGData.siteName,
      ogTitle: OGData.title,
      ogUrl: OGData.url,
      ogDescription: OGData.description,
      ogImage: OGData.image,
    };
  }

  // If the database data is expired or not present
  else {
    OGInfo = await getOGInfo(url);

    // Creating a mongo doc if it does not exist or update if exists
    const filter = { url: url };
    const update = {
      siteName: OGInfo.ogSiteName,
      title: OGInfo.ogTitle,
      url: OGInfo.ogUrl,
      description: OGInfo.ogDescription,
      image: OGInfo.ogImage,
      dateCreated: Date.now(),
    };
    const options = { upsert: true };

    await OGDatas.findOneAndReplace(filter, update, options);
  }

  return { OGInfo };
}
