const mongoose = require("mongoose");

const MODELNAME = "venue";

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    capacity: { type: Number, default: 0 },
    amenities: [{ type: String, trim: true }],
    image_url: { type: String, default: "" },
    owner_id: { type: String, ref: "user", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

Schema.index({ name: "text", city: "text", address: "text" });

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
