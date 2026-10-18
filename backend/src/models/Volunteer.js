import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "पूरा नाम आवश्यक है"],
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
    city: {
      type: String,
      default: "",
    },
    sevaType: {
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

export default mongoose.model("Volunteer", volunteerSchema);
