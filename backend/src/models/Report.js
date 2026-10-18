import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    cowId: {
      type: String,
      default: "",
    },
    cowName: {
      type: String,
      default: "",
    },
    cowPhoto: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "समस्या का विवरण आवश्यक है"],
    },
    photo: {
      type: String,
      default: "",
    },
    contactName: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "Under Review", "Resolved"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
