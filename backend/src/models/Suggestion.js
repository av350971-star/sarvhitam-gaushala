import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    suggestion: {
      type: String,
      required: [true, "सुझाव आवश्यक है"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Suggestion", suggestionSchema);
