import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema(
  {
    cowId: {
      type: String,
      default: "",
    },
    cowName: {
      type: String,
      default: "",
    },
    applicantName: {
      type: String,
      required: [true, "आवेदक का नाम आवश्यक है"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "फ़ोन नंबर आवश्यक है"],
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdoptionRequest", adoptionRequestSchema);
