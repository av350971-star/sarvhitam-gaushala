import mongoose from "mongoose";

const siteInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "सर्व हितम सेवा गौशाला समिति",
    },
    address: {
      type: String,
      default: "ग्राम संदलपुर, खातेगांव, देवास, मध्य प्रदेश",
    },
    phone: {
      type: String,
      default: "6232786661",
    },
    email: {
      type: String,
      default: "sarvahitamsevasamiti@gmail.com",
    },
    whatsapp: {
      type: String,
      default: "6232786661",
    },
    mapLink: {
      type: String,
      default: "https://maps.app.goo.gl/xQVzdzKsbNcNTSX3A?g_st=aw",
    },
    about: {
      type: String,
      default:
        "सर्व हितम सेवा गौशाला समिति (ग्राम संदलपुर, खातेगांव, देवास) बेसहारा, वृद्ध एवं बीमार गौवंश की सेवा, समुचित उपचार और संरक्षण के लिए समर्पित है।",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteInfo", siteInfoSchema);
