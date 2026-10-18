import mongoose from "mongoose";

const cowSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "गौ माता का नाम आवश्यक है"],
      trim: true,
    },
    photo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["स्वस्थ", "उपचाररत", "गंभीर", "गोद ली गई", "अन्य"],
      default: "स्वस्थ",
    },
    adoptionInfo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cow", cowSchema);
