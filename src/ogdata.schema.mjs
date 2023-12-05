import mongoose from "mongoose";

const openGraphSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  dateCreated: { type: Date, default: () => Date.now() },

  expireAt: {
    type: Date,
    expires: 11,
    default: Date.now,
  },
});

const OGDatas = mongoose.model("OGData", openGraphSchema);
export default OGDatas;
