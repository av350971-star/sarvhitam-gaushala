import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Image URL/Path is required"],
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: [
        "गौ सेवा",
        "गौ माता",
        "गौशाला",
        "चिकित्सा सेवा",
        "भोजन/चारा",
        "Volunteers",
        "Events",
        "Other",
      ],
      default: "Other",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
