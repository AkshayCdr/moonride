import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  phoneNumber: String,
  email: String,
  linkedId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  linkPrecedence: {
    type: String,
    enum: ["primary", "secondary"],
    default: "primary",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date,
});

export default mongoose.model("Contact", contactSchema);
