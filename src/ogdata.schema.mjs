import mongoose from "mongoose";

const openGraphSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  dateCreated: { type: Date, default: () => Date.now(), expires: "6h" },
});

const OGDatas = mongoose.model("OGData", openGraphSchema);
export default OGDatas;
