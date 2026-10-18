import mongoose from "mongoose";

const suggestedAmountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const donationSchema = new mongoose.Schema(
  {
    upiId: {
      type: String,
      default: "",
    },
    qrImage: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default:
        "यहाँ डोनेशन से जुड़ी जानकारी दिखेगी। कृपया Admin Panel में जाकर 'Donation Information' सेक्शन से UPI ID, QR कोड और विवरण जोड़ें।",
    },
    suggestedAmounts: {
      type: [suggestedAmountSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
